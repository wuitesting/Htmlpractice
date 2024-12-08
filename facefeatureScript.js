//////// script is

// Load models
Promise.all([
// async function loadModels() {
  //    console.log("Loading models...");
  //faceapi.nets.tinyFaceDetector.loadFromUri('model'),loadFaceLandmarkTinyModel(
  faceapi.loadFaceLandmarkTinyModel('./weights'),
  faceapi.loadFaceLandmarkModel('./weights'),
  faceapi.loadSsdMobilenetv1Model('./weights')

 // faceapi.nets.faceLandmark68Net.loadFromUri('model')
 //
 //   }
]).then(startMeasurement);
  console.log("Models loaded.");
async function startMeasurement() {
  const inputImage = document.getElementById('inputImage');
  const detections = await faceapi.detectSingleFace(inputImage).withFaceLandmarks();/// points detected with face 
  
  if (!detections) {
    console.log("No face detected");
    return;
  }
  
  const faceLandmarks = detections.landmarks;
  
  const leftEye = faceLandmarks.getLeftEye();
  const rightEye = faceLandmarks.getRightEye();
  const forehead = 0;//faceLandmarks.getForehead();
  const jawOutline = faceLandmarks.getJawOutline();
  
  const eyeWidth = distanceBetweenPoints(leftEye[0], rightEye[3]);
  const foreheadWidth = .foreheadWidth;//distanceBetweenPoints(forehead[0], forehead[5]);
  const jawWidth = distanceBetweenPoints(jawOutline[0], jawOutline[16]);
  //const faceLength = faceLandmarks.faceLength;//distanceBetweenPoints(jawOutline[8], forehead[8]);
  var outp = document.getElementById("output");
  ///
  const noseTip = faceLandmarks.positions[27];
  const noseBridge = faceLandmarks.positions[28];
  const noseLength = faceapi.euclideanDistance(noseTip, noseBridge);

  const mouthLeft = faceLandmarks.positions[48];
  const mouthRight = faceLandmarks.positions[54];
  const mouthWidth = faceapi.euclideanDistance(mouthLeft, mouthRight);

  const faceTop = faceLandmarks.positions[19];
  const faceBottom = faceLandmarks.positions[8];
  const faceLength = faceapi.euclideanDistance(faceTop, faceBottom);
  console.log(`Eye Width: ${eyeWidth.toFixed(2)} pixels`);
  //console.log(`Forehead Width: ${foreheadWidth.toFixed(2)} pixels`);
  console.log(`Jaw Width: ${jawWidth.toFixed(2)} pixels`);
  //console.log(`Face Length: ${faceLength.toFixed(2)} pixels`);
  outp.innerHTML = `
  Face Length: ${faceLength} cm
  Eye width: ${eyeWidth.toFixed(2)} cm 
  Mouth Width: ${mouthWidth} cm
  Jaw Width: ${jawWidth.toFixed(2)} cm
  Nose Length: ${noseLength} cm
`;
 //forehead Height: ${foreheadWidth.toFixed(2)} cm
  //face Height: ${faceLength.toFixed(2)} cm
}

function distanceBetweenPoints(point1, point2) {
  return Math.sqrt((point1.x - point2.x)**2 + (point1.y - point2.y)**2);
}
