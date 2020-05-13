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
*/

//Creates and positions but
const resetTop = topDim + 5 + "px"
const resetButton = newButton("RESET", resetTop, replay)
resetButton.style.height = buttonHeight + "px"

const pauseTop = (buttonHeight + 10 + topDim) + "px"
const pauseButton = newButton("PLAY", pauseTop, pause)

const switchTop = (2 * buttonHeight + 15 + topDim) + "px"
const switchButton = newButton("SWITCH", switchTop, switchScenario)

const addTop = (3 * buttonHeight + 20 + topDim) + "px"
const addButton = newButton("ADD", addTop, manager.setGradeLevel.bind(manager))
