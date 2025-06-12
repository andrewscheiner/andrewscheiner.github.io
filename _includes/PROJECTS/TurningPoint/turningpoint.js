/**
 * Turning Point
 * @author Andrew Scheiner
 */

//code converted from Python >> JavaScript
//using codeconvert.ai

//Global variables
var d1 = 0; //dice 1 value
var d2 = 0; //dice 2 value

//Keep for ML model
// window.onload = function() {
//     play();
// };

//clear text on page load
window.onload = function () {
    clearTPText()
}

// Add event listener for the "showValues" checkbox
document.addEventListener("DOMContentLoaded", function () {
    var showValuesCheckbox = document.getElementById("showValues");
    if (showValuesCheckbox) {
        showValuesCheckbox.addEventListener("change", function () {
            if (this.checked) {
                // Checkbox is checked: show dice values and sum if dice have been rolled
                if (d1 !== 0 && d2 !== 0) {
                    document.getElementById("dice1").innerHTML = "Dice 1: " + d1;
                    document.getElementById("dice2").innerHTML = "Dice 2: " + d2;
                    var dicesum_local = d1 + d2;
                    if (d1 === d2) {
                        document.getElementById("sum").innerHTML = "Doubles! Sum: " + dicesum_local + " or " + (dicesum_local * 2);
                    } else {
                        document.getElementById("sum").innerHTML = "Sum: " + dicesum_local;
                    }
                }
            } else {
                // Checkbox is not checked: clear dice values and sum
                document.getElementById("dice1").innerHTML = "";
                document.getElementById("dice2").innerHTML = "";
                document.getElementById("sum").innerHTML = "";
            }
        });
    }
});

/**
 * closeBoxes() runs when user has a move ready to be executed - input is checked for validity,
 * whether or not the guess will correctly close open boxes or will force win/loss.
 */
function closeBoxes() {
    //hide dice (signify end of turn)
    document.getElementById("dice").style.display = "none";

    //get list of dice values
    dList = [d1, d2];

    // Build move array from checked checkboxes
    var move = [];
    for (let i = 1; i <= 12; i++) {
        let checkbox = document.getElementById("cbox" + i);
        if (checkbox && checkbox.checked) {
            move.push(i);
        }
    }

    //get sums
    moveSum = move.reduce((a, b) => a + b, 0)
    dListSum = dList.reduce((a, b) => a + b, 0)

    //check if doubles were rolled:
    if (d1 === d2) {
        //check validity of input
        //if sum of guess = 2*sum of guess --> good
        if (moveSum === (dListSum * 2)) {
            processMove(move)
        }
        else {
            //check validity of input
            //if sum of guess = sum of guess --> also good even with doubles
            if (moveSum === dListSum) {
                processMove(move)
            }
            else {
                gameOver("Your move did not equal the sum or double the sum of the dice rolled.");
            }
        }

    }
    //if doubles were not rolled:
    else {
        //check validity of input
        //if sum of guess = sum of guess --> good
        if (moveSum === dListSum) {
            processMove(move)
        }
        //if sum of guess does not equal sum of dice --> game over
        else {
            gameOver("The sum of the numbers in your guess were not equal to the sum of the dice rolled.");
        }
    }

    //clear text, prep for next turn
    clearTPText();

    //check if user has won yet
    //if all boxes == 0 --> victory
    //get sum of boxes
    var boxSum = 0;
    for (let i = 1; i <= 12; i++) {
        var boxString = "box" + i;
        boxSum += parseInt(document.getElementById(boxString.toString()).innerHTML);
    }
    if (boxSum === 0) {
        gameWon();
    }

    //Keep for ML model
    //play();
}

/**
 * Process the boxes that user has selected to close.
 * @param move move to be made 
 */
function processMove(move) {
    //console.log("Processing move: " + move + " move length: " + move.length); //DEBUG
    //for each number the user includes in their move,
    for (let i = 0; i < move.length; i++) {
        //get box
        var boxString = "box" + move[i];
        var box = document.getElementById(boxString.toString()).innerHTML;
        //console.log("Box " + move[i] + ": " + parseInt(box)); // DEBUG
        //if box has not been closed yet,
        if (parseInt(box) !== 0) {
            //close box
            document.getElementById(boxString.toString()).innerHTML = "0";
            //make box background black for visual ease
            document.getElementById(boxString.toString()).style.backgroundColor = "#222";

            //darken checkbox
            var cboxString = "td_cbox" + move[i];
            document.getElementById(cboxString.toString()).style.backgroundColor = "#222";
            //remove check option
            var cbox_box = "cbox" + move[i];
            document.getElementById(cbox_box.toString()).style.display = "none";
        }
        else {
            gameOver("Box " + move[i] + " was already closed.");
        }
    }
}


/**
 * play() runs when the user clicks the button to roll dice. Updates webpage with values
 * of both dice so user can see.
 * 
 * Dice roll code source: https://www.sourcecodester.com/tutorial/javascript/16441/creating-dice-roll-animation-using-html-css-and-js-tutorial
 */
function play() {
    //DEBUG
    // for (let i = 1; i <= 12; i++) {
    //     var boxString = "box" + i;
    //     console.log(document.getElementById(boxString.toString()).innerHTML);
    // }
    //show dice, dice values
    document.getElementById("dice").style.display = "inline";

    const dice1 = document.getElementById('dice-1')
    const dice2 = document.getElementById('dice-2')

    // Animate Dices to Roll
    if (!dice1.classList.contains('rolling'))
        dice1.classList.add('rolling')
    if (!dice2.classList.contains('rolling'))
        dice2.classList.add('rolling')

    // Get Random values for dices
    var dice1Val = Math.floor((Math.random() * 6) + 1)
    var dice2Val = Math.floor((Math.random() * 6) + 1)
    setTimeout(() => {
        // set dices to random values after certain duration of rolling
        dice1.dataset.face = dice1Val;
        dice2.dataset.face = dice2Val;

        // remove rolling animation
        if (dice1.classList.contains('rolling'))
            dice1.classList.remove('rolling');
        if (dice2.classList.contains('rolling'))
            dice2.classList.remove('rolling');

        // Check if showValues checkbox is checked before displaying dice values and sum
        var showValues = document.getElementById("showValues");
        if (showValues && showValues.checked) {
            document.getElementById("dice1").innerHTML = "Dice 1: " + dice1Val;
            document.getElementById("dice2").innerHTML = "Dice 2: " + dice2Val;
            dicesum_local = dice1Val + dice2Val;

            //check doubles - print sum
            if (dice1Val === dice2Val) {
                document.getElementById("sum").innerHTML = "Doubles! Sum: " + dicesum_local + " or " + (dicesum_local) * 2;
            }
            else {
                document.getElementById("sum").innerHTML = "Sum: " + dicesum_local;
            }
        }

        //store dice rolls
        d1 = dice1Val;
        d2 = dice2Val;
    }, 3000);
}

/**
 * gameOver() alerts the user that they lost the game, the reason, and resets the boxes.
 */
function gameOver(reason) {
    alert("Game over! " + reason);

    //location.reload();

    clearTPText();

    resetBoxes();
}

/**
 * gameWon() alerts the user that they won and resets the boxes.
 */
function gameWon() {
    alert("YOU WON!")

    //location.reload();

    clearTPText();

    resetBoxes();
}

/**
 * clearTPText() clears dice input and the user input text box for visual ease.
 */
function clearTPText() {
    document.getElementById("dice1").innerHTML = "";
    document.getElementById("dice2").innerHTML = "";
    document.getElementById("sum").innerHTML = "";
    for (let i = 1; i <= 12; i++) {
        let checkbox = document.getElementById("cbox" + i);
        if (checkbox && checkbox.type === "checkbox") {
            checkbox.checked = false;
        }
    }
    //clear dice values too
    d1 = 0;
    d2 = 0;
}

/**
 * resetBoxes() converts all boxes back to their original values with the original color
 */
function resetBoxes() {
    //reset boxes
    for (let i = 1; i <= 12; i++) {
        var boxString = "box" + i;
        document.getElementById(boxString.toString()).innerHTML = i;
        document.getElementById(boxString.toString()).style.backgroundColor = "lightgreen";
    }

    for (let i = 1; i <= 12; i++) {
        var cboxString = "td_cbox" + i;
        document.getElementById(cboxString.toString()).style.backgroundColor = "lightgreen";
    }

    for (let i = 1; i <= 12; i++) {
        var td_cbox_x = "cbox" + i;
        document.getElementById(td_cbox_x.toString()).style.display = "inline";
    }
}