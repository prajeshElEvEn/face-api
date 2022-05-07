const video = document.getElementById('video')

const startVideo = () => {
    if (navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then((stream) => {
                video.srcObject = stream;
            })
            .catch((err) => {
                console.error("Something went wrong!" + err);
            });
    }
}

Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('../weights'),
    faceapi.nets.faceLandmark68Net.loadFromUri('../weights'),
    faceapi.nets.faceRecognitionNet.loadFromUri('../weights'),
    faceapi.nets.faceExpressionNet.loadFromUri('../weights')
])
    .then(startVideo)

video.addEventListener('play', () => {
    const canvas = faceapi.createCanvasFromMedia(video)
    const container = document.getElementById('vid-container')
    container.append(canvas)
    const displaySize = {
        width: video.width,
        height: video.height
    }
    faceapi.matchDimensions(canvas, displaySize)
    setInterval(async () => {
        const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
        const resizedDetections = faceapi.resizeResults(detections, displaySize)
        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
        faceapi.draw.drawDetections(canvas, resizedDetections)
        // faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
        faceapi.draw.drawFaceExpressions(canvas, resizedDetections)
    }, 100)
})