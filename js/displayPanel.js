//Set dimensions of game panels to respond to window size but not go above a limit size
let displayPanelHeight = Math.min(window.innerHeight, 500)
let displayPanelWidth = Math.min((window.innerWidth - 100), 600)


const ballpitPanel = document.getElementById("ballpitPanel")

//define variables to hold panel heights
//allows single point of change and ensures that both chart and ballpit panels together take up a set shared height
let chartHeight = 175
let ballpitPanelHeight = displayPanelHeight - chartHeight

//single point of change for positioning the game panels
//Panels are positioned absolutely and offset refers to distance from edge of window
let leftOffset = 100 + "px"
let topOffset = 50

//set layout for the panel containing the ball pit and controls
ballpitPanel.style.height =  ballpitPanelHeight + "px"
ballpitPanel.style.width = displayPanelWidth + "px"
ballpitPanel.style.top = topOffset + "px"
ballpitPanel.style.left = leftOffset

//set layout for the panel containing the chart tracking infected numbers
//automatically sits directly below the ball pit panel
const chartPanel = document.getElementById("chartPanel")
chartPanel.style.height =  chartHeight + "px"
chartPanel.style.width = displayPanelWidth + "px"
chartPanel.style.left = leftOffset
chartPanel.style.top = ballpitPanelHeight  + topOffset + "px"

//sets height of the chart itelf within the panel
const chartDiv = document.getElementById("chart")
chartDiv.style.height = chartHeight + "px"