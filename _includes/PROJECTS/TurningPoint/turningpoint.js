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

/**
 * closeBoxes() runs when user has a move ready to be executed - input is checked for validity,
 * whether or not the guess will correctly close open boxes or will force win/loss.
 */
function closeBoxes()
{
    //get list of dice values
    dList = [d1, d2];

    //split guess into multiple lists
    const preMove = document.getElementById("userBoxes").value.split(' ');

    //convert split-up guess into one list of numbers (the user's "move")
    var move = []
    for(let i = 0; i < preMove.length; i++)
    {
        move.push(Number(preMove[i]))
    }

    //get sums
    moveSum = move.reduce((a, b) => a + b, 0)
    dListSum = dList.reduce((a, b) => a + b, 0)

    //check validity of input
    //if sum of guess = sum of guess --> good
    //if sum of guess <= 12 --> good
    if(moveSum === dListSum) {
        if(moveSum <= 12) {
            //for each number the user includes in their move,
            for(let i = 0; i < move.length; i++) {
                //get box
                var boxString = "box"+move[i];
                var box = document.getElementById(boxString.toString()).innerHTML;
                //if box has not been closed yet,
                if(parseInt(box) !== 0)
                {
                    //close box
                    document.getElementById(boxString.toString()).innerHTML = "0";
                    //make box background black for visual ease
                    document.getElementById(boxString.toString()).style.backgroundColor = "#000000";
                }
                else {
                    gameOver("Box " + move[i] + " was already closed.");
                }
            }
        }
        //if sum of guess > 12 --> game over
        else {
            gameOver("The sum of the numbers in your guess were > 12.");
        }
    }
    //if sum of guess does not equal sum of dice --> game over
    else {
        gameOver("The sum of the numbers in your guess were not equal to the sum of the dice rolled.");
    }
    clearTPText();

    //check if user has won yet
    //if all boxes == 0 --> victory
    //get sum of boxes
    var boxSum = 0;
    for(let i = 1; i <= 12; i++) {
        var boxString = "box"+i;
        boxSum += parseInt(document.getElementById(boxString.toString()).innerHTML);
    }
    if(boxSum === 0) {
        gameWon();
    }

    //Keep for ML model
    //play();
}

/**
 * play() runs when the user clicks the button to roll dice. Updates webpage with values
 * of both dice so user can see.
 */
function play()
{
    //clear user input box
    document.getElementById("userBoxes").value = "";

    //generate two random dice rolls each 1-6
    const dice1Value = Math.floor(Math.random() * 6) + 1;
    const dice2Value = Math.floor(Math.random() * 6) + 1;
    
    //print and store dice rolls
    document.getElementById("dice1").innerHTML = "Dice 1: " + dice1Value;
    d1 = dice1Value;
    document.getElementById("dice2").innerHTML = "Dice 2: " + dice2Value;
    d2 = dice2Value;
}

/**
 * gameOver() alerts the user that they lost the game, the reason, and resets the boxes.
 */
function gameOver(reason)
{
    alert("Game over! " + reason);

    clearTPText();

    resetBoxes();
}

/**
 * gameWon() alerts the user that they won and resets the boxes.
 */
function gameWon()
{
    alert("YOU WON!")

    clearTPText();

    resetBoxes();
}

/**
 * clearTPText() clears dice input and the user input text box for visual ease.
 */
function clearTPText()
{
    document.getElementById("dice1").innerHTML = "";
    document.getElementById("dice2").innerHTML = "";
    document.getElementById("userBoxes").value = "";
}

/**
 * resetBoxes() converts all boxes back to their original values with the original color
 */
function resetBoxes()
{
    //reset boxes
    for(let i = 1; i <= 12; i++) {
        var boxString = "box"+i;
        document.getElementById(boxString.toString()).innerHTML = i;
        document.getElementById(boxString.toString()).style.backgroundColor = "lightgreen";
    }
}