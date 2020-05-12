let displayPanelHeight = Math.min(window.innerHeight, 500)
let displayPanelWidth = Math.min((window.innerWidth - 100), 800)
console.log("h: ", displayPanelHeight)
const ballpitPanel = document.getElementById("ballpitPanel")

let chartHeight = 150
let ballpitPanelHeight = displayPanelHeight - chartHeight
console.log(ballpitPanelHeight)

let leftOffset = 100 + "px"
let topOffset = 5

ballpitPanel.style.height =  ballpitPanelHeight + "px"
ballpitPanel.style.width = displayPanelWidth + "px"
ballpitPanel.style.top = topOffset + "px"
ballpitPanel.style.left = leftOffset

const chartPanel = document.getElementById("chartPanel")
chartPanel.style.height =  150 + "px"
chartPanel.style.width = displayPanelWidth + "px"
chartPanel.style.left = leftOffset
chartPanel.style.top = ballpitPanelHeight  + topOffset + "px"

const chartDiv = document.getElementById("chart")
chartDiv.style.height = chartHeight + "px"