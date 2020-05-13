//PROJECT NAME: INFECTION GAME
//FILE NAME: ballpitButtons.js
//EXTERNAL FILES: N/A
//PROGRAMMERS: Jacob Luciani - Jacob.Luciani@gmail.com
//COURSE: 4500-002 SP2020
//DATE FINISHED: 05/12/2020
//DESCRIPTION: Creates and positions buttons for ball pit game
/*EXTERNAL RESOURCES USED:
https://www.w3schools.com/jsref/dom_obj_canvas.asp
https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/Object_building_practice
https://www.w3schools.com/jsref/jsref_min.asp
https://medium.com/@theredwillows/moving-an-element-with-javascript-part-1-765c6a083d45
*/



//Reset button resets the current settings for the ballpit using replay function
const resetTop = topDim + 5 + "px"
const resetButton = newButton("RESET", resetTop, replay)
resetButton.style.height = buttonHeight + "px"

//pause button starts/stops the animation loop, preserving the current game
const pauseTop = (buttonHeight + 10 + topDim) + "px"
const pauseButton = newButton("PLAY", pauseTop, pause)

/*
//UNIT TEST BUTTONS
//Used to test functionality of the ballpit as a separate component of the project
//Act as interface with subset of ballpit's capabilities for runtime testing

//Switch button switches between scenarios, used for debugging and not in the final program
//const switchTop = (2 * buttonHeight + 15 + topDim) + "px"
//const switchButton = newButton("SWITCH", switchTop, switchScenario)

//lets the player add 10 balls to the pit and reset the scenario
const moreTop = (3 * buttonHeight + 20 + topDim) + "px"
const moreButton = newButton("MORE", moreTop, add10)

//lets the player take away 10 balls from the pit and resets the scenario
const lessTop = (4 * buttonHeight + 25 + topDim) + "px"
const lessButton = newButton("LESS", lessTop, sub10)
*/