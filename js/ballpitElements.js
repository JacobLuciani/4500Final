const leftDim = 10
const topDim = 10
const buttonHeight = 25
const buttonWidth = 70

const ballpitCanvas = document.createElement("CANVAS")
ballpitPanel.appendChild(ballpitCanvas)

class OptionsManager {
    constructor(gradeLevel = 0) {
        this.gradeLevel = gradeLevel
    }

    setGradeLevel(newGradeLevel) {
        this.gradeLevel = newGradeLevel
        this.setupButtons()
    }

    setupButtons() {

    }
}

function newButton(name, top, onClick, style = "playStyle") {
    //console.log(name)
    const newButton = document.createElement("BUTTON");
    newButton.innerHTML = name
    newButton.classList.add(style)
    newButton.style.left = 5 + "px"
    newButton.style.top = top
    newButton.onclick = function() { onClick() }

    ballpitPanel.appendChild(newButton);
    return newButton
}


//const ballpitCanvas = document.querySelector("#ballpit")
const ballpitCtx = ballpitCanvas.getContext('2d')

const width = (ballpitCanvas.width = ballpitPanel.clientWidth - (leftDim * 2 + buttonWidth))
const height = (ballpitCanvas.height = ballpitPanel.clientHeight - 50) //fix

ballpitCanvas.classList.add("ballpitStyle")
//panel.style.top = topDim + "px"
//panel.style.left = leftDim + "px"

ballpitCanvas.style.left = (leftDim + buttonWidth) + "px"

const playTop = topDim + 5 + "px"
const playButton = newButton("RESET", playTop, replay)
playButton.style.height = buttonHeight + "px"

const pauseTop = (buttonHeight + 10 + topDim) + "px"
const pauseButton = newButton("PLAY", pauseTop, pause)

const switchTop = (2 * buttonHeight + 15 + topDim) + "px"
const switchButton = newButton("SWITCH", switchTop, switchScenario)

const addTop = (3 * buttonHeight + 20 + topDim) + "px"
const addButton = newButton("ADD", addTop, add10)

let elem1 = document.createElement('label1')
ballpitPanel.appendChild(elem1)

let elem2 = document.createElement('label2')
ballpitPanel.appendChild(elem2)

let timer = document.createElement('timer')
ballpitPanel.appendChild(timer)

function replay() {
    loopCount =  0
    pauseButton.disabled = false
    pauseButton.classList.remove("disabledButton")

    cancelAnimationFrame(requestId)

    if (pauseButton.innerHTML === "PAUSE") {
        pauseButton.innerHTML = "PLAY"
    }
    ballpit.setup()

    balls = ballpit.balls

    drawInitial()
    remakeGraph()
}

function pause() {
    if (pauseButton.innerHTML === "PAUSE") {
        cancelAnimationFrame(requestId)
        stopGraph()
        pauseButton.innerHTML = "PLAY"
    } else {
        requestId = loop()
        startGraph()
        pauseButton.innerHTML = "PAUSE"
    }
}

let scenario = 0

function switchScenario() {
    if (scenario === 0) {
        ballpit.setNewStart(1, 100)
        scenario = 1
    } else if (scenario === 1) {
        ballpit.setNewStart(1, 3)
        scenario = 2
    } else if (scenario === 2) {
        ballpit.setNewStart(1, 30)
        scenario = 0
    }
    replay()
}

function add10() {
    let start = ballpit.startParameters
    //console.log(ballpit.startParameters)
    start.totalPopulation += 10
    //console.log(start)
    ballpit.setNewStart(start.initialInfected, start.totalPopulation)
    replay()
}