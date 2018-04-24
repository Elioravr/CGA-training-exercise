const PROGRESS_CANVAS_WIDTH = 300
const PROGRESS_CANVAS_HEIGHT = 300
const PROGRESS_RADIUS_WIDTH = 100

let video
let progressCanvas
let videoCanvas

document.addEventListener('DOMContentLoaded', () => {
  video = document.getElementById('video')
  progressCanvas = document.getElementById('canvas-progress')
  videoCanvas = document.getElementById('canvas-video')
}, false);


// Requesting the video file:
const req = new XMLHttpRequest()
req.open('GET', "https://upload.wikimedia.org/wikipedia/commons/6/6c/%22Movbild-fizika%22_falo_en_Big_Buck_Bunny.webm", true)
// req.open('GET', "https://upload.wikimedia.org/wikipedia/commons/1/18/Big_Buck_Bunny_Trailer_1080p.ogv", true)
// req.open('GET', "https://upload.wikimedia.org/wikipedia/commons/d/d9/Jet_d%27eau_de_Gen%C3%A8ve_%282018%29.webm", true)
// req.open('GET', "http://upload.wikimedia.org/wikipedia/commons/7/79/Big_Buck_Bunny_small.ogv", true)
req.responseType = 'blob'

req.onload = function() {
  if (this.status === 200) {
    const videoBlob = this.response
    const vid = URL.createObjectURL(videoBlob)
    const container = document.getElementById('container')
    video.src = vid

    // Success!
    _drawProgress(100)
    progressCanvas.className += "popping-out"
    container.className += "video-ready"
    videoCanvas.className += "video-ready"

    video.addEventListener('play', _handleVideoPlay)

    video.play()
  }
}

req.addEventListener("progress", ({loaded, total}) => {
  const percentages = Math.round(loaded / total * 100)

  _drawProgress(percentages)
})

req.send()

const _drawProgress = (percentages) => {
  const startAngle = 0
  let endAngle = 360 - percentages * 360 / 100

  if (percentages === 100) {
    endAngle = 360
  }

  _drawCircle(startAngle, endAngle, `${percentages}%`)
}

const _handleVideoPlay = () => {
  let videoCtx

  if (videoCanvas.getContext) {
    videoCtx = videoCanvas.getContext('2d')
  }

  let videoHeight
  let videoWidth
  let videoCanvasHeight
  const windowWidth = document.body.clientWidth
  const videoCanvasWidth = windowWidth * 0.9

  video.addEventListener('loadedmetadata', () => {
    videoHeight = video.videoHeight
    videoWidth = video.videoWidth
    videoCanvasHeight = videoCanvasWidth * (videoHeight / videoWidth)
    videoCanvas.width = videoCanvasWidth
    videoCanvas.height = videoCanvasHeight
  })


  if (!video.paused && !video.ended) {
    setInterval(() => _drawVideoCurrentFrame(video, videoCtx, videoCanvasHeight, videoCanvasWidth), 1000 / 30)
  }
}

const _drawVideoCurrentFrame = (video, ctx, height, width) => {
  ctx.drawImage(video, 0, 0, width, height)
}

const _drawCircle = (startAngle, endAngle, text) => {
  progressCanvas.width = PROGRESS_CANVAS_WIDTH
  progressCanvas.height = PROGRESS_CANVAS_HEIGHT
  if (progressCanvas.getContext) {
    const ctx = progressCanvas.getContext('2d')
    const x = PROGRESS_CANVAS_WIDTH / 2
    const y = PROGRESS_CANVAS_HEIGHT / 2

    startAngle = _getRadianAngle(startAngle)
    endAngle = _getRadianAngle(endAngle)

    ctx.beginPath()
    ctx.arc(x, y, PROGRESS_RADIUS_WIDTH, startAngle, endAngle, false)
    ctx.lineWidth = 12
    ctx.strokeStyle = 'white'
    ctx.fillStyle = 'white'
    ctx.stroke()
    ctx.font = '48px serif'
    ctx.textAlign="center"
    ctx.textBaseline="middle"
    ctx.fillText(text, x, y)
  }
}

const _getRadianAngle = (angle) => {
  return Math.PI * 1.5 - (Math.PI/180) * angle
}
