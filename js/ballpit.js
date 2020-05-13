//PROJECT NAME: INFECTION GAME
//FILE NAME: ballpit.js
//EXTERNAL FILES: N/A
//PROGRAMMERS: Jacob Luciani - Jacob.Luciani@gmail.com
//COURSE: 4500-002 SP2020
//DATE FINISHED: 05/12/2020
//DESCRIPTION: Manages ballpit model and graphical display
//             includes functionality for animation as well as endpoints for data retrieval by other project components
/*EXTERNAL RESOURCES USED:
https://www.w3schools.com/howto/howto_js_add_class.asp
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes
https://www.w3schools.com/jsref/jsref_min.asp
https://developer.mozilla.org/en-US/docs/Web/API/Window/cancelAnimationFrame

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
      //produces correct probability according to parameter
      if (moving < this.startParameters.portionMoving * 100 ) {
        numMoving++
        x = random(-2, 2)
        y = random(-2, 2)
      }

      //create the new Ball object
      let ball = new Ball(
          // ball position always drawn at least one ball width
          // away from the adge of the canvas, to avoid drawing errors
          random(size, width - size),
          random(size, height - size),
          x,
          y,
          'rgb(' + 0 + ',' + 255 + ',' + 0 + ')', //green for uninfected
          size,
          false
      )

      //the initial balls are made red and set to infected status
      //continues until the set initialInfected parameter has been reached
      if (this.balls.length < this.initialInfected) {
        ball.color = 'rgb(' + 255 + ',' + 0 + ',' + 0 + ')'
        ball.infected = true
      }

      //add the ball to the class object's array
      this.balls.push(ball)
    }
  }

  //checks individual ball for collision with all balls contained within class object's array
  detectCollision(ball) {

    //loop through and check for each ball
    for (let j = 0; j < balls.length; j++) {

      //exclude "collision" between a ball and itself
      if (!(ball === balls[j])) {

        //calculate the distance between the two balls
        const dx = ball.x - balls[j].x
        const dy = ball.y - balls[j].y
        const distance = Math.sqrt(dx * dx + dy * dy)

        //compare the distance with the combined radii of the two balls
        //if the distance is less, the balls are touching
        if (distance < ball.size + balls[j].size) {

          //if the ball is not already infected, change its color and set it to infected
          if (balls[j].infected && !ball.infected) {
            ball.color = balls[j].color
            ball.infected = true

            //increment the class object's counter for infected balls
            this.infectedCount++
          }
        }
      }
    }
  }
}

//create globally accessible object to manage game scenarios and settings
//also creates necessary objects (ballpit)
let manager = new OptionsManager()
//retrieve the Ballpit object created by the manager
let ballpit = manager.ballpit

//run initial setup operations on the ballpit
ballpit.setup()
//retrieve array of balls for display
let balls = ballpit.balls

//tracks uninfected numbers for ease of use in display
let uninfected = 0

//store id of requestAnimationFrame for starting/stopping
let requestId

//track looping status and the game's "time" - converted from approximate 60 Hz provided by requestAnimationFrame
let loopCount = 0
let looping = false

//Used to draw a single frame of the ballpit without animating
//Allows for an image of all of the balls to be shown before animation begins
function drawInitial() {

  //first frame drawn completely opaque
  ballpitCtx.fillStyle = 'rgba(0,0,0,1)'
  //set to fill full ballpit
  ballpitCtx.fillRect(0, 0, width, height)

  //uninfected variable retrieved for display
  uninfected = ballpit.getUninfected()

  //loop through and call each ball's draw function
  for (let i = 0; i < balls.length; i++) {
    balls[i].draw()
  }

  //set contents of display labels
  //elem1 - uninfected count
  //elem2 - infected count
  //timer - number of simulated seconds the animation has been running (based on 60 Hz)
  elem1.innerHTML = '<h1>' + uninfected + '</h1>'
  elem2.innerHTML = '<h2>' + ballpit.getInfected() + '</h2>'
  timer.innerHTML = '<h3>' + (loopCount/60) + '.0</h3>'
}

//draws the initial frame before animation begins
drawInitial()

//main animation loop function
function loop() {
  looping = true

  //set fill to 75% opacity to leave small trail/motion blur
  //applied to whole ballpit
  ballpitCtx.fillStyle = 'rgba(0,0,0,0.75)'
  ballpitCtx.fillRect(0, 0, width, height)

  //loop through and call each ball's draw function
  for (let i = 0; i < balls.length; i++) {
    balls[i].draw()
    balls[i].update()
    ballpit.detectCollision(balls[i])
  }

  //set contents of display labels
  //elem1 - uninfected count
  //elem2 - infected count
  uninfected = ballpit.getUninfected()
  elem1.innerHTML = '<h1>' + uninfected + '</h1>'
  elem2.innerHTML = '<h2>' + ballpit.getInfected() + '</h2>'

  //update system's simulated timer
  loopCount++
  //ever six iterations is a simulated .1 second, so label must be updated
  if (loopCount % 6 === 0) {

    let seconds = loopCount/60

    //ensure consistent inclusion of the decimal place in the timer
    if (Number.isInteger(seconds)) {
      timer.innerHTML = '<h3>' + (loopCount/60) + '.0</h3>'
    } else {
      timer.innerHTML = '<h3>' + (loopCount/60) + '</h3>'
    }
    //update the ballpit's history data ever time the clock is updated
    ballpit.addToHistory(loopCount)
  }
  //calls for animation on loop function
  requestId = requestAnimationFrame(loop)

  //checks for total population infection, ends loop if no uninfected left
  if(uninfected === 0) {
    //set opacity to 100% to remove tails in final screen
    ballpitCtx.fillStyle = 'rgba(0,0,0,1.0)'
    ballpitCtx.fillRect(0, 0, width, height)

    //loop through and call each ball's draw function
    //colors the last ball as "infected" before animation stops
    for (let i = 0; i < balls.length; i++) {
      balls[i].draw()
    }

    //adjust pause button behavior and styling
    pauseButton.disabled = true
    pauseButton.classList.add("disabledButton")

    looping = false

    //end animation and stop graph updating
    cancelAnimationFrame(requestId)
    stopGraph()
  }
}