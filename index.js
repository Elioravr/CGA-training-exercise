const PROGRESS_CANVAS_WIDTH = 300
const PROGRESS_CANVAS_HEIGHT = 300
const PROGRESS_RADIUS_WIDTH = 100

// Requesting the video file:
var req = new XMLHttpRequest()
// req.open('GET', "https://upload.wikimedia.org/wikipedia/commons/6/6c/%22Movbild-fizika%22_falo_en_Big_Buck_Bunny.webm", true)
req.open('GET', "https://upload.wikimedia.org/wikipedia/commons/1/18/Big_Buck_Bunny_Trailer_1080p.ogv", true)
req.responseType = 'blob'

req.onload = function() {
   if (this.status === 200) {
      var videoBlob = this.response
      var vid = URL.createObjectURL(videoBlob)
      const canvas = document.getElementById('canvas')
      const container = document.getElementById('container')
      const video = document.getElementById('video')
      video.src = vid

     // Success!
     _drawProgress(100)
     canvas.className += "popping-out"
     container.className += "video-ready"
     video.className += "video-ready"

     // setTimeout(() => video.play(), 1500)
   }
}

req.addEventListener("progress", ({loaded, total}) => {
  const percentages = Math.round(loaded / total * 100)

  /* console.log(`loaded: ${Math.round(percentages)}`) */
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

const _drawCircle = (startAngle, endAngle, text) => {
  const canvas = document.getElementById('canvas')
  canvas.width = PROGRESS_CANVAS_WIDTH
  canvas.height = PROGRESS_CANVAS_HEIGHT
  if (canvas.getContext) {
    const ctx = canvas.getContext('2d')
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
