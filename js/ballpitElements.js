const leftDim = 10
const topDim = 10
const buttonHeight = 25
const buttonWidth = 70

const ballpitCanvas = document.createElement("CANVAS")
ballpitPanel.appendChild(ballpitCanvas)

let scenarios = [[[1, 100, 1],[10, 100, 1],[1, 500, 1]],
                 [[1, 100, .5],[1, 100, .2],[1, 100, .1]]]

let scenario = 0

function switchScenario() {
    scenario = (scenario + 1) % 3
    manager.switchScenarios(scenario)
}

class OptionsManager {

    //takes in number associated with the grade level band
    //0: K-2
    constructor(gradeLevel = 1) {
        this.scenario = scenarios[gradeLevel][0]
        this.gradeLevel = gradeLevel
        this.ballpit = new Ballpit(this.scenario)
        this.ballpit.setup()
    }

    setGradeLevel(newGradeLevel = -1) {
        if (newGradeLevel == -1) {
            this.gradeLevel = (this.gradeLevel + 1) % 2
        } else {
            this.gradeLevel = newGradeLevel
        }
        console.log(newGradeLevel, this.gradeLevel)
        this.switchScenarios(0)

        //this.setupButtons()
    }

    /* To be used for a Sandbox mode in grades 6-8
    setupButtons() {

    }*/

    //returns the current scenario
    getScenario() {
        return scenarios[this.gradeLevel][this.scenario]
    }

    //switches to scenario of given index in current grade level
    switchScenarios(newScenario) {
        this.scenario = scenarios[this.gradeLevel][newScenario]
        this.ballpit.setNewStart(this.scenario[0], this.scenario[1], this.scenario[2])
        replay()
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

const width = (ballpitCanvas.width = ballpitPanel.clientWidth - buttonWidth - 10)
const height = (ballpitCanvas.height = ballpitPanel.clientHeight) //fix
//console.log(displayPanelHeight)
ballpitCanvas.classList.add("ballpitStyle")
//panel.style.top = topDim + "px"
//panel.style.left = leftDim + "px"

ballpitCanvas.style.left = (leftDim + buttonWidth) + "px"


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



function add10() {
    let start = ballpit.startParameters
    //console.log(ballpit.startParameters)
    start.totalPopulation += 10
    //console.log(start)
    ballpit.setNewStart(start.initialInfected, start.totalPopulation)
    replay()
}