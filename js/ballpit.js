//PROJECT NAME: INFECTION GAME
//FILE NAME: ballpit.js
//EXTERNAL FILES: N/A
//PROGRAMMERS: Jacob Luciani - Jacob.Luciani@gmail.com
//COURSE: 4500-002 SP2020
//DATE FINISHED: 05/12/2020
//DESCRIPTION: Creates and positions buttons for ball pit game
/*EXTERNAL RESOURCES USED:
https://www.w3schools.com/howto/howto_js_add_class.asp
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes
https://www.w3schools.com/jsref/jsref_min.asp

SPECIAL RECOGNITION TO:
https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/Object_building_practice
-provided the starting point for the graphical display of the ballpit
*/

//Generates random numbers within parameter-defined boundaries
//Used for ball creation/velocity and probability checks
function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

//Create Ball object with input properties
function Ball(x, y, velX, velY, color, size, infected) {
  this.x = x
  this.y = y
  this.velX = velX
  this.velY = velY
  this.color = color
  this.size = size
  this.infected = infected
}

//Defines graphical display of a single ball on a canvas context
Ball.prototype.draw = function () {
  ballpitCtx.beginPath()

  //get color from Ball object and sets the context's draw color
  ballpitCtx.fillStyle = this.color

  //creates a circle with the size and place stored in the Ball
  ballpitCtx.arc(this.x, this.y, this.size, 0, 2 * Math.PI)
  ballpitCtx.fill()
}

//Defines ball location and velocity update method
//Used to progress the animation
Ball.prototype.update = function () {

  //detects collision with the right side of the ballpit
  //inverts the Ball's x velocity
  if (this.x + this.size >= width) {
    this.velX = -this.velX
  }

  //detects collision with the lef side of the ballpit
  //inverts the Ball's x velocity
  if (this.x - this.size <= 0) {
    this.velX = -this.velX
  }

  //detects collision with the bottom of the ballpit
  //inverts the Ball's y velocity
  if (this.y + this.size >= height) {
    this.velY = -this.velY
  }

  //detects collision with the top of the ballpit
  //inverts the Ball's y velocity
  if (this.y - this.size <= 0) {
    this.velY = -this.velY
  }

  //moves the ball according to the now-verified velocity
  this.x += this.velX
  this.y += this.velY
}

//class Ballpit creates and manages a list of balls depending on input conditions
//Tracks number of "infected" balls, total population, uninfected population
//gives functionality to check for collision
class Ballpit {
  //takes in parameters used to initialize a group of balls
  constructor(scenario) {
    this.setNewStart(scenario[0], scenario[1], scenario[2])
  }

  //takes in time variable and stores the current number of infected balls
  //used as data source for chart-based display
  addToHistory(loopCount) {
    this.history[0].push(loopCount/60)
    this.history[1].push(this.infectedCount)
  }

  //setter function for initializer parameters
  //used when changing scenario and restarting
  setNewStart(initialInfected, totalPopulation, portionMoving = 1) {
    this.startParameters = {initialInfected, totalPopulation, portionMoving}
  }

  //returns number of infected balls
  getInfected() {
    return this.infectedCount
  }

  //returns number of uninfected balls
  getUninfected() {
    return (this.totalPopulation - this.infectedCount)
  }

  //clears and sets class property variables
  //ensures no holdovers from previous uses
  //triggers creation of array of Balls
  setup() {
    //clear class's array
    this.balls = []

    //set class properties to new variables for easier acccess
    this.infectedCount = this.startParameters.initialInfected
    this.initialInfected = this.startParameters.initialInfected
    this.totalPopulation = this.startParameters.totalPopulation

    //starts data history
    this.history = [[0],[this.initialInfected]]

    //create the balls that will populate the Ballpit
    this.makeBalls()
  }

  //creates array of balls according to current parameters and populates the class object's property
  makeBalls() {

    //test variable: used to track the number of balls that have a chance of moving
    //all other balls will be stationary - simulates stay-at-home measures
    let numMoving = 0

    //loop creation of Ball objects until the target population is reached
    while (this.balls.length < this.totalPopulation) {

      //defines the size of the balll
      const size = 3

      //simulates percent chance by picking number between 0 and 99
      //initialize velocity parameters to 0
      let moving = random(0, 99)
      let x = 0
      let y = 0

      //if number generated is below the "percent moving" variable, given a random velocity
      //
      if (moving < this.startParameters.portionMoving * 100 ) {
        numMoving++
        x = random(-2, 2)
        y = random(-2, 2)
      }
      let ball = new Ball(
          // ball position always drawn at least one ball width
          // away from the adge of the canvas, to avoid drawing errors
          random(size, width - size),
          random(size, height - size),
          x,
          y,
          'rgb(' + 0 + ',' + 255 + ',' + 0 + ')',
          size,
          false
      )
      if (this.balls.length < this.initialInfected) {
        ball.color = 'rgb(' + 255 + ',' + 0 + ',' + 0 + ')'
        ball.infected = true
      }
      this.balls.push(ball)
    }
  }

  detectCollision(ball) {
    for (let j = 0; j < balls.length; j++) {
      if (!(ball === balls[j])) {
        const dx = ball.x - balls[j].x
        const dy = ball.y - balls[j].y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < ball.size + balls[j].size) {

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

let manager = new OptionsManager()
let ballpit = manager.ballpit

//let ballpit = new Ballpit([1,30])
ballpit.setup()
let balls = ballpit.balls
let uninfected = 0
let requestId
let loopCount = 0
let looping = false

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
  looping = true

  ballpitCtx.fillStyle = 'rgba(0,0,0,0.75)'
  ballpitCtx.fillRect(0, 0, width, height)

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

    looping = false

    cancelAnimationFrame(requestId)
    stopGraph()
  }
}