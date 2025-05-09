/**
 * © Andrew Scheiner 2025
 */

//images and top layer
let greenCheck;
let redX;
let topLayer;

//image size and canvas variables
let imgSize= 100;
let canvX = 25;
let canvY = 50;

//box size, spacing
let boxSize = 100;
let spacing = 50;

//global canvas
let p5Canvas;

//correct answers and number of questions
//Prof. Richeson (Dickinson College) lab answers for MATH171 - 4/30/2025
let correctAnswers = [
  "A", "C", "D", "A", "B",
  "A", "D", "B", "C", "A",
  "A", "C", "A", "C", "B",
  "D", "C", "A", "B", "A"
];
let numQs = correctAnswers.length;

//export canvas
function exportCanvas() {
  //get student names
  let namesInput = document.querySelector('input[id="names"]').value;
  //edit names to be valid for file names
  namesInput = namesInput.replace(/,\s*/g, '-').replace(/\s+/g, '');
  //save canvas with filename as student names
  saveCanvas(namesInput, "png");
  //save(p5Canvas, 'myCanvas.csv');
}

//load X and checkmark images
function preload() {
  greenCheck = loadImage("greenCheck.jpg");
  redX = loadImage("redX.jpg");
}

//check to see if the user has answered the question
//this is for save state purposes - if the user left the page and comes back, we want to know what they answered
function figureOutAnswers() {
  let cookieAnswers = document.cookie
    .split('; ')
    .find(row => row.startsWith('userAnswers='));

  if (cookieAnswers) {
    let savedAnswers = JSON.parse(cookieAnswers.split('=')[1]);

    savedAnswers.forEach(answer => {
      let questionIndex = parseInt(answer.question.replace('Question ', '')) - 1;
      let optionIndex = answer.option.charCodeAt(7) - 65; // Convert 'Option A' to 0, 'Option B' to 1, etc.

      let boxX = optionIndex * (boxSize + spacing) + canvX;
      let boxY = 50 + (150 * questionIndex);

      // Remove the top layer in the specific box location
      //topLayer.noStroke();
      topLayer.fill(173, 216, 230); // Match the background color of the top layer
      topLayer.rect(boxX, boxY, boxSize, boxSize);
    });
  }
}

//setup canvas
function setup() {
  //create canvas
  //(width, height)
  p5Canvas = createCanvas(150*4, correctAnswers.length*150+50);

  //top layer
  topLayer = createGraphics(width, height);
  topLayer.background(173, 216, 230); // Light baby blue color
  //topLayer.background(200);
  topLayer.textSize(50);
  topLayer.textAlign(CENTER);

  //generate A,B,C,D top layer text
  for(let i = 0; i < numQs; i++)
  {
    //text, x, y
    topLayer.text("A", 50+canvX, 115+((boxSize+spacing)*i));
    topLayer.text("B", 200+canvX, 115+((boxSize+spacing)*i));
    topLayer.text("C", 350+canvX, 115+((boxSize+spacing)*i));
    topLayer.text("D", 500+canvX, 115+((boxSize+spacing)*i));
  }
    
  topLayer.imageMode(CENTER);
  topLayer.strokeWeight(10);
  topLayer.blendMode(REMOVE);
  
  figureOutAnswers();
}

//generate checks and Xs based on correct answer
function generateQA(qii)
{
  if(correctAnswers[qii]=="A")
  {
    //image, x, y, width, height
    image(greenCheck, canvX, canvY+(150*qii), imgSize, imgSize);
    image(redX, canvX+150, canvY+(150*qii), imgSize, imgSize);
    image(redX, canvX+300, canvY+(150*qii), imgSize, imgSize);
    image(redX, canvX+450, canvY+(150*qii), imgSize, imgSize);
  }
  else if(correctAnswers[qii]=="B")
  {
    //image, x, y, width, height
    image(redX, canvX, canvY+(150*qii), imgSize, imgSize);
    image(greenCheck, canvX+150, canvY+(150*qii), imgSize, imgSize);
    image(redX, canvX+300, canvY+(150*qii), imgSize, imgSize);
    image(redX, canvX+450, canvY+(150*qii), imgSize, imgSize);
  }
  else if(correctAnswers[qii]=="C")
  {
    //image, x, y, width, height
    image(redX, canvX, canvY+(150*qii), imgSize, imgSize);
    image(redX, canvX+150, canvY+(150*qii), imgSize, imgSize);
    image(greenCheck, canvX+300, canvY+(150*qii), imgSize, imgSize);
    image(redX, canvX+450, canvY+(150*qii), imgSize, imgSize);
  }
  else if(correctAnswers[qii]=="D")
  {
    //image, x, y, width, height
    image(redX, canvX, canvY+(150*qii), imgSize, imgSize);
    image(redX, canvX+150, canvY+(150*qii), imgSize, imgSize);
    image(redX, canvX+300, canvY+(150*qii), imgSize, imgSize);
    image(greenCheck, canvX+450, canvY+(150*qii), imgSize, imgSize);
  }
}

//list of user attempted answers
let userAnswers = [];

// Check if "userAnswers" cookie exists and initialize accordingly
let refreshAnswers = document.cookie
  .split('; ')
  .find(row => row.startsWith('userAnswers='));
if (refreshAnswers) {
  let refAnswersX = JSON.parse(refreshAnswers.split('=')[1]);
  userAnswers = refAnswersX.map(answer => ({
    question: answer.question,
    option: answer.option
  }));
}

//check if mouse is in the box
function checkMouseLocation(mx, my) {
  for (let q = 0; q < numQs; q++) {
    for (let i = 0; i < 4; i++) {
      let boxX = i * (boxSize + spacing) + canvX;
      let boxY = 50 + (150 * q);
      if (mx > boxX && mx < boxX + boxSize && my > boxY && my < boxY + boxSize) {
        //console.log(`Mouse is over box: Question ${q + 1}, Option ${String.fromCharCode(65 + i)}`);
        let answer = {
          question: `Question ${q + 1}`,
          option: `Option ${String.fromCharCode(65 + i)}`
        };
        // Check if the answer already exists in userAnswers
        if (!userAnswers.some(a => a.question === answer.question && a.option === answer.option)) {
          userAnswers.push(answer);
          console.log(userAnswers);
          console.log(`User answers: ${userAnswers.map(a => `${a.question}: ${a.option}`).join(', ')}`);
          // Store the user answers in a cookie
          document.cookie = `userAnswers=${JSON.stringify(userAnswers)}; path=/; expires=${new Date(Date.now() + 24 * 60 * 60 * 1000).toUTCString()};`;
        }
        return;
      }
    }
  }
}

//when user draws
function draw() {
  //generate checks and Xs
  for(let qNum = 0; qNum < numQs; qNum++)
  {
    generateQA(qNum);
  }
  
  //top layer
  if(mouseIsPressed) {
    topLayer.line(pmouseX, pmouseY, mouseX, mouseY);
    checkMouseLocation(mouseX, mouseY);
  }
  image(topLayer, 0, 0);
  stroke(0);
  noFill();
  
  //draw boxes with a slight black border and "Question i" text
  for(let q = 0; q < numQs; q++) {
    // Draw the border around the set of boxes
    stroke(0); // Black border
    strokeWeight(2); // Slight border thickness
    noFill();
    rect(canvX-5, 50 + (150 * q) - spacing / 2, 10 + (boxSize + spacing) * 4 - spacing, boxSize + spacing);

    // Add "Question i" text
    noStroke();
    fill(0); // Black text
    textSize(20);
    textAlign(LEFT, CENTER);
    text("Question " + (q + 1), canvX, 50 + (150 * q) - spacing / 2 + boxSize / 2 - 35);

    // Draw individual boxes
    for(let i = 0; i < 4; i++) {
      stroke(0);
      strokeWeight(1);
      noFill();
      rect(i * (boxSize + spacing) + canvX, 50 + (150 * q), boxSize, boxSize);
    }
  }
}