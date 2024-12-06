//Here's the updated code with the calculation of face length:



// Import FaceAPI.js
//const faceapi = require('face-api.js');

// Load the face detection model
async function loadModels() {
  
  await faceapi.loadFaceDetectionModel('./weights');
  await faceapi.loadFaceLandmarkModel('./weights');
  await faceapi.loadSsdMobilenetv1Model('./weights');
  await faceapi.loadTinyYolov2Model('./weights');
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
 //const options = new faceapi.TinyFaceDetectorOptions({ inputSize: 320 });
  const options = new faceapi.SsdMobilenetv1Options({ minConfidence: 0.8 })
  // Create a video element to display the webcam feed
  const video = document.createElement('video');// document.getElementById('ínputVideo'); //document.createElement('video');
  video.width = 640;
  video.height = 480;

  // Request access to the webcam
  navigator.mediaDevices.getUserMedia({ video: true })
    .then((stream) => {
      // Set the video element's source to the webcam stream
      video.srcObject = stream;

      // Create a canvas element to draw the face detection results
      const canvas =  document.getElementById('overlay');//document.createElement('canvas');
      canvas.width = 640;
      canvas.height = 480;

      // Create a face detection interval
      setInterval(async () => {
        // Get the current frame from the video element
        const dims = faceapi.matchDimensions(canvas, video,true);
        const detections = faceapi.detectSingleFace(video,options,true).withFaceLandmarks();
         if (!detections) {
                console.log("No face detected");
                return;
          }
        const faceLandmarks = detections.landmarks;
  /**
  const leftEye = faceLandmarks.getLeftEye();
  const rightEye = faceLandmarks.getRightEye();
  const forehead = 0;//faceLandmarks.getForehead();
  const jawOutline = faceLandmarks.getJawOutline();
  
  const eyeWidth = distanceBetweenPoints(leftEye[0], rightEye[3]);
  const foreheadWidth = faceLandmarks.foreheadWidth;//distanceBetweenPoints(forehead[0], forehead[5]);
  const jawWidth = distanceBetweenPoints(jawOutline[0], jawOutline[16]);
      */  
        const frame = faceapi.resizeResults(detections, dims);

        // Draw the face detection results on the canvas
        //faceapi.matchDimensions(canvas, video,true);
        /*const ctx = document.getElementById('overlay');canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        ctx.drawImage(video, 0, 0);*/
        if (frame) { // Draw the face landmarks on the canvas
          faceapi.draw.drawDetections(canvas, frame);
            //faceapi.draw.drawFaceLandmarks(canvas, frame);
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
