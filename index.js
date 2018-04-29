const PROGRESS_CANVAS_WIDTH = 300
const PROGRESS_CANVAS_HEIGHT = 300
const PROGRESS_RADIUS_WIDTH = 100
const FRAMES_PER_SECOND = 30
const ICON_SIZE = 100
const ICONS_SHOW_OFFSET = ICON_SIZE / 2

let video
let progressCanvas
let videoCanvas
let frameUpdaterInterval
let videoHeight
let videoWidth
let videoCanvasHeight
let windowWidth
let videoCanvasWidth
let videoCanvasBoundingRect

document.addEventListener('DOMContentLoaded', () => {
  video = document.getElementById('video')
  progressCanvas = document.getElementById('canvas-progress')
  videoCanvas = document.getElementById('canvas-video')

  windowWidth = document.body.clientWidth
  videoCanvasWidth = windowWidth * 0.9

  videoCanvas.addEventListener('click', _handleVideoClick)
  video.addEventListener('loadedmetadata', _handleVideoLoadMetadata)
}, false);

// Requesting the video file:
const req = new XMLHttpRequest()
req.open('GET', 'https://upload.wikimedia.org/wikipedia/commons/6/6c/%22Movbild-fizika%22_falo_en_Big_Buck_Bunny.webm', true)
// req.open('GET', 'https://upload.wikimedia.org/wikipedia/commons/1/18/Big_Buck_Bunny_Trailer_1080p.ogv', true)
// req.open('GET', 'https://upload.wikimedia.org/wikipedia/commons/d/d9/Jet_d%27eau_de_Gen%C3%A8ve_%282018%29.webm', true)
// req.open('GET', 'http://upload.wikimedia.org/wikipedia/commons/7/79/Big_Buck_Bunny_small.ogv', true)
req.responseType = 'blob'

req.onload = function() {
  if (this.status === 200) {
    const videoBlob = this.response
    const vid = URL.createObjectURL(videoBlob)
    const container = document.getElementById('container')
    video.src = vid

    // Success!
    _drawProgress(100)
    progressCanvas.className += 'popping-out'
    container.className += 'video-ready'
    videoCanvas.className += 'video-ready'

    video.addEventListener('play', _handleVideoPlay)

    // Waiting for the opening animation to over
    setTimeout(() => video.play(), 1500)
  }
}

req.addEventListener('progress', ({loaded, total}) => {
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

const _handleVideoLoadMetadata = () => {
  videoHeight = video.videoHeight
  videoWidth = video.videoWidth
  videoCanvasHeight = videoCanvasWidth * (videoHeight / videoWidth)
  videoCanvas.width = videoCanvasWidth
  videoCanvas.height = videoCanvasHeight
}

const _handleVideoClick = ({clientX, clientY}) => {
  let iconName
  if (video.paused) {
    video.play()
    iconName = 'play'
  } else {
    video.pause()
    iconName = 'pause'
    clearInterval(frameUpdaterInterval)
  }
  _showIcon(iconName, clientX, clientY)
}

const _showIcon = (iconName, x, y) => {
  // Hide all icons
  const icons = document.querySelectorAll('.icon')
  icons.forEach((icon) => {
    icon.setAttribute('style', 'display: none')
  })

  // Calculating icon position
  const {
    top: videoCanvasTop,
    left: videoCanvasLeft,
    width: videoCanvasWidth,
    height: videoCanvasHeight
  } = videoCanvasBoundingRect

  let iconTop = y - ICONS_SHOW_OFFSET
  let iconLeft = x - ICONS_SHOW_OFFSET

  // Checking if the top/left are breaking the 'walls' of the canvas
  iconTop = iconTop < videoCanvasTop ? iconTop + ICONS_SHOW_OFFSET : iconTop
  iconTop = iconTop + ICON_SIZE > videoCanvasTop + videoCanvasHeight ? iconTop - ICONS_SHOW_OFFSET : iconTop

  iconLeft = iconLeft < videoCanvasLeft ? iconLeft + ICONS_SHOW_OFFSET : iconLeft
  iconLeft = iconLeft + ICON_SIZE > videoCanvasLeft + videoCanvasWidth ? iconLeft - ICONS_SHOW_OFFSET : iconLeft

  // Show only the requested icon
  const icon = document.getElementById(`${iconName}-icon`)
  icon.setAttribute('style', `display: block; top: ${iconTop}px; left: ${iconLeft}px`)
}

const _handleVideoPlay = () => {
  let videoCtx

  if (videoCanvas.getContext) {
    videoCtx = videoCanvas.getContext('2d')
  }

  const windowWidth = document.body.clientWidth
  const videoCanvasWidth = windowWidth * 0.9

  if (!video.paused && !video.ended) {
    frameUpdaterInterval = setInterval(() => _drawVideoCurrentFrame(videoCtx, videoCanvasHeight, videoCanvasWidth), 1000 / FRAMES_PER_SECOND)
  }
}

const _drawVideoCurrentFrame = (ctx, height, width) => {
  ctx.drawImage(video, 0, 0, width, height)

  if (!videoCanvasBoundingRect) {
    videoCanvasBoundingRect = videoCanvas.getBoundingClientRect()
  }
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
    ctx.textAlign='center'
    ctx.textBaseline='middle'
    ctx.fillText(text, x, y)
  }
}

const _getRadianAngle = (angle) => {
  return Math.PI * 1.5 - (Math.PI/180) * angle
}
