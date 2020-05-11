const leftDim = 10
const topDim = 10
const buttonHeight = 25
const buttonWidth = 70

function newButton(name, top, onClick, style = "playStyle") {
    //console.log(name)
    const newButton = document.createElement("BUTTON");
    newButton.innerHTML = name
    newButton.classList.add(style)
    newButton.style.left = leftDim + 5 + "px"
    newButton.style.top = top
    newButton.onclick = function() { onClick() }

    document.body.appendChild(newButton);
    return newButton
}

const panel = document.getElementById("ballpitPanel")

const ballpitCanvas = document.querySelector("#ballpit")
const ballpitCtx = ballpitCanvas.getContext('2d')

const width = (ballpitCanvas.width = panel.clientWidth - (leftDim * 2 + buttonWidth))
const height = (ballpitCanvas.height = window.innerHeight - 50) //fix

ballpitCanvas.classList.add("ballpitStyle")
panel.style.top = topDim + "px"
panel.style.left = leftDim + "px"

ballpitCanvas.style.left = (leftDim + buttonWidth) + "px"

const playTop = topDim + 5 + "px"
const playButton = newButton("RESET", playTop, replay)
playButton.style.height = buttonHeight + "px"

const pauseTop = (buttonHeight + 10 + topDim) + "px"
const pauseButton = newButton("PAUSE", pauseTop, pause)

switchTop = (2 * buttonHeight + 15 + topDim) + "px"
const switchButton = newButton("SWITCH", switchTop, switchScenario)

let elem1 = document.createElement('label1')
panel.appendChild(elem1)

let elem2 = document.createElement('label2')
panel.appendChild(elem2)

//console.log(hi, hi)
function replay(count) {
    pauseButton.disabled = false
    pauseButton.classList.remove("disabledButton")

    cancelAnimationFrame(requestId)

    if (pauseButton.innerHTML == "PLAY") {
        pauseButton.innerHTML = "PAUSE"
    }
    ballpit.setup()
    balls = ballpit.balls
    loop()
}

function pause() {
    if (pauseButton.innerHTML == "PAUSE") {
        cancelAnimationFrame(requestId)
        pauseButton.innerHTML = "PLAY"
    } else {
        requestId = loop()
        pauseButton.innerHTML = "PAUSE"
    }
}

var scenario = 0

function switchScenario() {
    if (scenario == 0) {
        ballpit.setNewStart(5, 100)
        scenario = 1
    } else if (scenario == 1) {
        ballpit.setNewStart(1, 3)
        scenario = 2
    } else if (scenario == 2) {
        ballpit.setNewStart(5, 30)
        scenario = 0
    }
    replay()
}