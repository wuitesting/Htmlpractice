////////////////////////// A few helper functions ///////////////////////////////////////////   
  
function resizeCanvasAndResults(dimensions, canvas, results) {
  const { width, height } = dimensions instanceof HTMLVideoElement
    ? faceapi.getMediaDimensions(dimensions)
    : dimensions
  canvas.width = width
  canvas.height = height

  return results.map(res => res.forSize(width, height))
}

  
function drawDetections(dimensions, canvas, detections) {
  const resizedDetections = resizeCanvasAndResults(dimensions, canvas, detections)
  faceapi.drawDetection(canvas, resizedDetections)
}

  
function drawLandmarks(dimensions, canvas, results, withBoxes = true) {
  const resizedResults = resizeCanvasAndResults(dimensions, canvas, results)
  if (withBoxes) {
      faceapi.drawDetection(canvas, resizedResults.map(det => det.detection))
  }
  const faceLandmarks = resizedResults.map(det => det.landmarks)
  const drawLandmarksOptions = { lineWidth: 2, drawLines: true, color: 'green' }
  faceapi.drawLandmarks(canvas, faceLandmarks, drawLandmarksOptions)
}    
    

  
////////////////////////// The 2 Main functions ///////////////////////////////////////////  
  
async function onPlay() {
   const videoEl = document.getElementById('inputVideo')
   const options = new faceapi.TinyFaceDetectorOptions({ inputSize: 128, scoreThreshold : 0.3 }) 

   
   result = await faceapi.detectSingleFace(videoEl, options).withFaceLandmarks(true)
   if (result) {
       drawLandmarks(videoEl, document.getElementById('overlay'), [result], true)
     
      // Just printing the first of 68 face landmark x and y 
      document.getElementById('myDiv01').innerHTML = 'First of 68 face landmarks, x: '+ 
        Math.round(result._unshiftedLandmarks._positions[0]._x) + ', y: '+ 
        Math.round(result._unshiftedLandmarks._positions[0]._y) +'<br>' 
        
   }

    setTimeout(() => onPlay())
}

async function run() {
  // await faceapi.loadTinyFaceDetectorModel('https://hpssjellis.github.io/face-api.js-for-beginners/')
  // await faceapi.loadFaceLandmarkTinyModel('https://hpssjellis.github.io/face-api.js-for-beginners/')
  await faceapi.loadTinyFaceDetectorModel('https://www.rocksetta.com/tensorflowjs/saved-models/face-api-js/')
   await faceapi.loadFaceLandmarkTinyModel('https://www.rocksetta.com/tensorflowjs/saved-models/face-api-js/')
      
   const stream = await navigator.mediaDevices.getUserMedia({ video: {} })
   const videoEl = document.getElementById('inputVideo')
   videoEl.srcObject = stream
}

