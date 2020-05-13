//PROJECT NAME: INFECTION GAME
//FILE NAME: ballpitElements.js
//EXTERNAL FILES: N/A
//PROGRAMMERS: Jacob Luciani - Jacob.Luciani@gmail.com
//COURSE: 4500-002 SP2020
//DATE FINISHED: 05/12/2020
//DESCRIPTION: Sets up display HTML elements for the ballpit and defines settings manager class
//             provides functionality for ease of modification of ballpit's interface
/*EXTERNAL RESOURCES USED:
https://developer.mozilla.org/en-US/docs/Web/API/Window/cancelAnimationFrame
https://www.w3schools.com/howto/howto_js_add_class.asp
https://www.w3schools.com/jsref/dom_obj_canvas.asp
https://medium.com/@theredwillows/moving-an-element-with-javascript-part-1-765c6a083d45
*/

//variables used to in layout and styling of HTML elements
const leftDim = 10
const topDim = 10
const buttonHeight = 25
const buttonWidth = 70

//Creates the canvas on which the ballpit game will be displayed and adds it to the panel
const ballpitCanvas = document.createElement("CANVAS")
ballpitPanel.appendChild(ballpitCanvas)

//Stores information about the scenarios presented in each level of the game
//Information stored as a triplet of initialInfected, totalPopulation, and percentMoving
//First array level represents grade level, second represents order within grade level
let scenarios = [[[1, 100, 1],[10, 100, 1],[1, 500, 1]],
                 [[1, 100, .5],[1, 100, .2],[1, 100, .1]]]

/*
//Used in testing with "switch" button
let scenario = 0

function switchScenario() {
    scenario = (scenario + 1) % 3
    manager.switchScenarios(scenario)
}*/

//OptionsManager class controls scenarios for ballpit game and general settings
//Creates ballpit object to control data
class OptionsManager {

    //takes in number associated with the grade level band
    //0: K-2
    //1: 3-5
    //2: 6-8 TO BE ADDED
    constructor(gradeLevel = 0) {
        //store input as class property
        //defaults to K-2 scenario and first scenario for the grade
        this.scenario = scenarios[gradeLevel][0]
        this.gradeLevel = gradeLevel

        //create ballpit according to the proper scenario and run initial setup
        this.ballpit = new Ballpit(this.scenario)
        this.ballpit.setup()
    }

    //setter for changing the grade level
    setGradeLevel(newGradeLevel = -1) {
        //default value of -1 used for testing with button, cycles through existing grade level options
        if (newGradeLevel === -1) {
            //if currently on 0, go to 1
            //if currently on 1, go to 0
            //extendable by changing 2 to number of grade levels desired
            this.gradeLevel = (this.gradeLevel + 1) % 2
        } else {
            //input value received, grade level set accordingly
            this.gradeLevel = newGradeLevel
        }
        //switch to the first scenario for the new grade level
        this.switchScenarios(0)

        //this.setupButtons()
    }

    /* To be used for a Sandbox mode in grades 6-8
    setupButtons() {

    }*/

    //returns the current scenario identifier
    getScenario() {
        return scenarios[this.gradeLevel][this.scenario]
    }

    //switches to scenario of given index in current grade level
    switchScenarios(newScenario) {
        //retrieve proper scenario data
        this.scenario = scenarios[this.gradeLevel][newScenario]

        //set ballpit settings according to new scenario and restart the game
        this.ballpit.setNewStart(this.scenario[0], this.scenario[1], this.scenario[2])
        replay()
    }
}

//Provides utility function for adding new buttons to the ballpit
//Allows for easier customization of the ballpit's interface by programmer
function newButton(name, top, onClick, style = "playStyle") {

    //standardized type, style, and left inset
    const newButton = document.createElement("BUTTON");
    newButton.innerHTML = name //sets button text to input
    newButton.classList.add(style)
    newButton.style.left = 5 + "px"
    newButton.style.top = top //allows for different button heights on ballpit sidebar
    newButton.onclick = function() { onClick() } //set new button functionality

    //add newly created button to the panel
    ballpitPanel.appendChild(newButton);

    //return button for referencing later (pseudo-outlet)
    return newButton
}

//retrieve graphics context for all drawing/animation
const ballpitCtx = ballpitCanvas.getContext('2d')

//determine and set dimensions of the ballpit game within the panel
const width = (ballpitCanvas.width = ballpitPanel.clientWidth - buttonWidth - 10)
const height = (ballpitCanvas.height = ballpitPanel.clientHeight) //fix

//add custom css styling and left inset (leaves room for sidebar)
ballpitCanvas.classList.add("ballpitStyle")
ballpitCanvas.style.left = (leftDim + buttonWidth) + "px"

//Create label elements to display infected/uninfected and the simulated game time
let elem1 = document.createElement('label1')
ballpitPanel.appendChild(elem1)

let elem2 = document.createElement('label2')
ballpitPanel.appendChild(elem2)

let timer = document.createElement('timer')
ballpitPanel.appendChild(timer)

//restarts the game and animation and all associated variables
function replay() {

    //reset system simulated time and ensure pause button is enabled and has appropriate styling
    loopCount =  0
    pauseButton.disabled = false
    pauseButton.classList.remove("disabledButton")

    //end animation
    cancelAnimationFrame(requestId)

    //ensure pause/play button text fits action
    if (pauseButton.innerHTML === "PAUSE") {
        pauseButton.innerHTML = "PLAY"
    }
    //rerun initial setup for the now-set scenario
    ballpit.setup()

    //retrieve ball data for drawing
    balls = ballpit.balls

    //draw initial frame before animation
    drawInitial()
    //reset and prepare chart for new game run
    remakeGraph()
}

//Used to start/stop the animation loop
//relabels the button to be consistent with its behavior
function pause() {
    if (pauseButton.innerHTML === "PAUSE") {
        looping = false
        cancelAnimationFrame(requestId) //halt the animation loop
        stopGraph() //stops the graph's updating
        pauseButton.innerHTML = "PLAY" //switch button text
    } else {
        requestId = loop() //start the animation loop
        startGraph() //start the graph's updating
        pauseButton.innerHTML = "PAUSE" //switch button text
    }
}

//ADDITIONAL FUNCTIONALITY SECTION:
//These functions are used for testing and future sandbox mode
//Associated with buttons so ballpit functionality may be tested separate from general site interface

//adds 10 to the total population of the current scenario, up to 2000
//changes not stored- reloading by switching to another scenario and back resets values
function add10() {
    //retrieve current parameters for ballpit
    let start = ballpit.startParameters

    //if balls are being added, they can also be removed (can't be below limit)
    //ensure "less" button is enabled and correctly styled
    lessButton.disabled = false
    lessButton.classList.remove("disabledButton")

    //checks for potential overshooting of upper limit
    if (start.totalPopulation <= 1990) {
        //upper limit will not be exceeded, so 10 balls added
        start.totalPopulation += 10
        //update ballpit's parameters and refresh the game
        ballpit.setNewStart(start.initialInfected, start.totalPopulation, start.portionMoving)
        replay()
    }
    //checks if the upper limit has been reached
    if ( start.totalPopulation >= 2000) {
        //upper limit has been reached, add button is disabled
        moreButton.disabled = true
        moreButton.classList.add("disabledButton")
    }
}

//subtracts 10 from the total population of the current scenario, down to 10
//changes not stored- reloading by switching to another scenario and back resets values
function sub10() {
    //retrieve the current parameters for the ballpit
    let start = ballpit.startParameters

    //if balls are being removed, they can also be added (can't be above limit)
    //ensure "more" button is enabled and correctly styled
    moreButton.disabled = false
    moreButton.classList.remove("disabledButton")

    //check for lower limit overshoot
    if (start.totalPopulation > 19) {
        //will not overshoot lower limit, so lower total population by 10 balls
        start.totalPopulation -= 10
        //update ballpit's parameters and refresh the game
        ballpit.setNewStart(start.initialInfected, start.totalPopulation, start.portionMoving)
        replay()
    }
    //checks if the lower limit has been reached
    if( start.totalPopulation < 20) {
        console.log("hia")
        lessButton.disabled = true
        lessButton.classList.add("disabledButton")
    }
}