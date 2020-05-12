let displayPanelHeight = Math.min(window.innerHeight, 600)
let displayPanelWidth = Math.min((window.innerWidth - 100), 800)
console.log("h: ", displayPanelHeight)
const ballpitPanel = document.getElementById("ballpitPanel")

let ballpitPanelHeight = displayPanelHeight - 150
console.log(ballpitPanelHeight)

ballpitPanel.style.height =  ballpitPanelHeight + "px"
ballpitPanel.style.width = displayPanelWidth + "px"
ballpitPanel.style.top = "50px"
ballpitPanel.style.left = "200px"

const chartPanel = document.getElementById("chartPanel")
chartPanel.style.height =  150 + "px"
chartPanel.style.width = displayPanelWidth + "px"
chartPanel.style.left = "100px"
chartPanel.style.top = ballpitPanelHeight + "px"