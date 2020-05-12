function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function Ball(x, y, velX, velY, color, size, infected) {
  this.x = x
  this.y = y
  this.velX = velX
  this.velY = velY
  this.color = color
  this.size = size
  this.infected = infected
}

Ball.prototype.draw = function () {
  ballpitCtx.beginPath()
  ballpitCtx.fillStyle = this.color
  ballpitCtx.arc(this.x, this.y, this.size, 0, 2 * Math.PI)
  ballpitCtx.fill()
}

// define ball update method

Ball.prototype.update = function () {
  if (this.x + this.size >= width) {
    this.velX = -this.velX
  }

  if (this.x - this.size <= 0) {
    this.velX = -this.velX
  }

  if (this.y + this.size >= height) {
    this.velY = -this.velY
  }

  if (this.y - this.size <= 0) {
    this.velY = -this.velY
  }

  this.x += this.velX
  this.y += this.velY
}

class Ballpit {
  constructor(initialInfected = 1, totalPopulation = 30) {
    this.startParameters = {initialInfected, totalPopulation}
    this.setup(initialInfected, totalPopulation)
  }

  addToHistory(loopCount) {
    this.history[0].push(loopCount)
    this.history[1].push(this.infectedCount)
  }

  setGradeLevel(newGradeLevel) {
    this.gradeLevel = newGradeLevel
  }

  setNewStart(initialInfected, totalPopulation) {
    this.startParameters = {initialInfected, totalPopulation}
  }

  getInfected() {
    return this.infectedCount
  }

  getUninfected() {
    return (this.totalPopulation - this.infectedCount)
  }

  setup() {

    this.balls = []

    this.infectedCount = this.startParameters.initialInfected
    this.initialInfected = this.startParameters.initialInfected
    this.totalPopulation = this.startParameters.totalPopulation
    this.history = [[0],[this.initialInfected]]


    this.makeBalls()
  }

  makeBalls() {

    while (this.balls.length < this.totalPopulation) {

      const size = 3
      let ball = new Ball(
          // ball position always drawn at least one ball width
          // away from the adge of the canvas, to avoid drawing errors
          random(size, width - size),
          random(size, height - size),
          random(-2, 2),
          random(-2, 2),
          'rgb(' + 0 + ',' + 255 + ',' + 0 + ')',
          size,
          false
      )
      if (this.balls.length < this.initialInfected) {
        //console.log("sick")
        ball.color = 'rgb(' + 255 + ',' + 0 + ',' + 0 + ')'
        ball.infected = true
      }
      this.balls.push(ball)
        //console.log("healthy")
    }
    //return this.balls
  }

  detectCollision(ball) {
    for (let j = 0; j < balls.length; j++) {
      if (!(ball === balls[j])) {
        const dx = ball.x - balls[j].x
        const dy = ball.y - balls[j].y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < ball.size + balls[j].size) {
          //console.log(distance)
          if (balls[j].infected && !ball.infected) {
            ball.color = balls[j].color
            ball.infected = true
            this.infectedCount++
          }
        }
      }
    }
  }
}

let ballpit = new Ballpit(5, 30)
//ballpit.setup(1,10)
//ballpit.loop()
let balls = ballpit.balls
let uninfected = 0
let requestId
let loopCount = 0

function drawInitial() {
  ballpitCtx.fillStyle = 'rgba(0,0,0,1)'
  ballpitCtx.fillRect(0, 0, width, height)
  uninfected = ballpit.getUninfected()
  for (let i = 0; i < balls.length; i++) {
    balls[i].draw()
  }
  elem1.innerHTML = '<h1>' + uninfected + '</h1>'
  elem2.innerHTML = '<h2>' + ballpit.getInfected() + '</h2>'
  timer.innerHTML = '<h3>' + (loopCount/60) + '.0</h3>'
}
drawInitial()

function loop() {
  ballpitCtx.fillStyle = 'rgba(0,0,0,0.75)'
  ballpitCtx.fillRect(0, 0, width, height)
  //console.log(this.balls)
  for (let i = 0; i < balls.length; i++) {
    balls[i].draw()
    balls[i].update()
    ballpit.detectCollision(balls[i])
  }

  uninfected = ballpit.getUninfected()
  elem1.innerHTML = '<h1>' + uninfected + '</h1>'
  elem2.innerHTML = '<h2>' + ballpit.getInfected() + '</h2>'

  loopCount++
  if (loopCount % 6 === 0) {
    let seconds = loopCount/60
    if (Number.isInteger(seconds)) {
      timer.innerHTML = '<h3>' + (loopCount/60) + '.0</h3>'
    } else {
      timer.innerHTML = '<h3>' + (loopCount/60) + '</h3>'
    }
    ballpit.addToHistory(loopCount)
  }

  requestId = requestAnimationFrame(loop)

  if(uninfected === 0) {
    ballpitCtx.fillStyle = 'rgba(0,0,0,1.0)'
    ballpitCtx.fillRect(0, 0, width, height)
    for (let i = 0; i < balls.length; i++) {
      balls[i].draw()
    }
    pauseButton.disabled = true
    pauseButton.classList.add("disabledButton")
    cancelAnimationFrame(requestId)
    stopGraph()
  }
}