//////// script is

// Load models
Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('https://cdn.jsdelivr.net/npm/face-api/models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('https://cdn.jsdelivr.net/npm/face-api/models')
]).then(startMeasurement);

async function startMeasurement() {
  const inputImage = document.getElementById('inputImage');
  const detections = await faceapi.detectSingleFace(inputImage).withFaceLandmarks();
  
  if (!detections) {
    console.log("No face detected");
    return;
  }
  
  const faceLandmarks = detections.landmarks;
  
  const leftEye = faceLandmarks.getLeftEye();
  const rightEye = faceLandmarks.getRightEye();
  const forehead = faceLandmarks.getForehead();
  const jawOutline = faceLandmarks.getJawOutline();
  
  const eyeWidth = distanceBetweenPoints(leftEye[0], rightEye[3]);
  const foreheadWidth = distanceBetweenPoints(forehead[0], forehead[5]);
  const jawWidth = distanceBetweenPoints(jawOutline[0], jawOutline[16]);
  const faceLength = distanceBetweenPoints(jawOutline[8], forehead[8]);
  var outp = getElementById("output");

  console.log(`Eye Width: ${eyeWidth.toFixed(2)} pixels`);
  console.log(`Forehead Width: ${foreheadWidth.toFixed(2)} pixels`);
  console.log(`Jaw Width: ${jawWidth.toFixed(2)} pixels`);
  console.log(`Face Length: ${faceLength.toFixed(2)} pixels`);
  outp.innerHTML = `
  Eye width: ${eyeWidth.toFixed(2)} cm
  forehead Height: ${foreheadWidth.toFixed(2)} cm
  face Height: ${faceLength.toFixed(2)} cm
  jaw Width: ${jawWidth.toFixed(2)} cm
`;

}

function distanceBetweenPoints(point1, point2) {
  return Math.sqrt((point1.x - point2.x)**2 + (point1.y - point2.y)**2);
}
