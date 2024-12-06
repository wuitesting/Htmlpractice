//Here's the updated code with the calculation of face length:



// Import FaceAPI.js
//const faceapi = require('face-api.js');

// Load the face detection model
async function loadModels() {
  await faceapi.loadFaceDetectionModel('/weights');
  await faceapi.loadFaceLandmarkModel('/weights');
}

// Calculate nose length, mouth width, and face length
async function calculateFaceMetrics(face) {
  const noseTip = face.landmarks.positions[27];
  const noseBridge = face.landmarks.positions[28];
  const noseLength = faceapi.euclideanDistance(noseTip, noseBridge);

  const mouthLeft = face.landmarks.positions[48];
  const mouthRight = face.landmarks.positions[54];
  const mouthWidth = faceapi.euclideanDistance(mouthLeft, mouthRight);

  const faceTop = face.landmarks.positions[19];
  const faceBottom = face.landmarks.positions[8];
  const faceLength = faceapi.euclideanDistance(faceTop, faceBottom);

  return { noseLength, mouthWidth, faceLength };
}

// Main function
async function main() {
  await loadModels();

  // Create a video element to display the webcam feed
  const video = document.createElement('video');
  video.width = 640;
  video.height = 480;

  // Request access to the webcam
  navigator.mediaDevices.getUserMedia({ video: true })
    .then((stream) => {
      // Set the video element's source to the webcam stream
      video.srcObject = stream;

      // Create a canvas element to draw the face detection results
      const canvas = document.createElement('canvas');
      canvas.width = 640;
      canvas.height = 480;

      // Create a face detection interval
      setInterval(async () => {
        // Get the current frame from the video element
        const frame = faceapi.resizeResults(faceapi.detectSingleFace(video).withFaceLandmarks(), video);

        // Draw the face detection results on the canvas
        faceapi.matchDimensions(canvas, video);
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(video, 0, 0);
        if (frame) {
          // Draw the face landmarks on the canvas
          faceapi.draw.drawDetections(canvas, frame);

          // Calculate nose length, mouth width, and face length
          const { noseLength, mouthWidth, faceLength } = await calculateFaceMetrics(frame);

          // Print results
          console.log(`Nose Length: ${noseLength}`);
          console.log(`Mouth Width: ${mouthWidth}`);
          console.log(`Face Length: ${faceLength}`);
        }
      }, 100);
    })
    .catch((error) => {
      console.error('Error accessing webcam:', error);
    });
}

main();
//```
