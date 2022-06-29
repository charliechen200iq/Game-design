/**
* Title: Game design
* Author: Charlie Chen
* Date: 08/07/2022
* Purpose: Design game
**/

// Some constants that will be used in this scripts
// Width of the canvas 
const WIDTH = 1000;
// Width of the canvas
const HEIGHT = 800;
// SqaureWidth is the size of the square (40px * 4px) that the canvas is divided to (25squares * 20squares)
const squareWidth = 40
// Objects with all the colour thar we can access from
const GAMECOLOUR = {
    "playerColour": "#0000FF", 
    "playerBorderColour": "#000000", 
    "correctPaintColour": "#0000FF", 
    "correctPaintBorderColour":"#000000",
    "wrongPaintColour": "#7DF9FF", 
    "wrongPaintBorderColour":"#000000"
}

// Some variables that will be needed
// The coordinates of the player on the canvas
var player = [
    {x: squareWidth * 5, y: squareWidth * 3},
    {x: squareWidth * 4, y: squareWidth * 3},
    {x: squareWidth * 3, y: squareWidth * 3},
    {x: squareWidth * 3, y: squareWidth * 3},
    {x: squareWidth * 2, y: squareWidth * 3}
]
// The canvas rendering context
var ctx
// The score of the game
var score = 0;
// The game runs on the interval 
var gameInterval;
// Horizontal velocity of player
var dx = squareWidth;
// Vertical velocity of player
var dy = 0;
// Correct paint x position 
var correctPaintX;
// Correct paint y position 
var correctPaintY;
// Wrong paint x position 
var wrongPaintX;
// Wrong paint y position 
var wrongPaintY;


//When content loads run the function startCanvas
window.onload=startCanvas
//This function is the starting screen of the game
function startCanvas(){
    // Return a two dimensional drawing context
    ctx=document.getElementById("myCanvas").getContext("2d")

    clearCanvas();
    ctx.font = "40px comic"
    ctx.fillStyle = "black"
    ctx.textAlign = 'center';
    ctx.fillText("Help the painter to fill the canvas with dark blue paint.", WIDTH/2, HEIGHT*3/10);
    ctx.fillText("Avoid the light blue paint!", WIDTH/2, HEIGHT*4/10);

    ctx.font = "70px comic"
    ctx.fillText("Click Anywhere to Start Game", WIDTH/2, HEIGHT*3/5);

    ctx.fillStyle = GAMECOLOUR["correctPaintColour"];
    ctx.strokestyle = GAMECOLOUR["correctPaintBorderColour"];
    ctx.fillRect(940, 210, squareWidth, squareWidth);
    ctx.strokeRect(940, 210, squareWidth, squareWidth);
    ctx.fillStyle = GAMECOLOUR["wrongPaintColour"];
    ctx.strokestyle = GAMECOLOUR["wrongPaintBorderColour"];
    ctx.fillRect(720, 290, squareWidth, squareWidth);
    ctx.strokeRect(720, 290, squareWidth, squareWidth);

    window.addEventListener('click', onClick);
    function onClick(){
        updateCanvas()
    }
}



function updateCanvas(){
    get_healthy_food()
    get_poison_food()

    //runs the game by making the snake move, and constantly check if it is dying 
    gameInterval = setInterval(()=> {
        if(has_game_ended() == true){
            gameEnd();
        } else {
            clearCanvas();
            drawFood();
            move_player();
            drawPlayer();
        }
    },100) 
}



function gameEnd(){
    //stop the game from running
    clearCanvas(); 
    clearInterval(gameInterval)
    console.log("you died!!!")

    ctx.font = "90px comic "
    ctx.fillStyle = "black"
    ctx.textAlign = 'center';
    ctx.fillText("You died!", WIDTH/2, HEIGHT*2/5);
    ctx.fillText("Click Anywhere to Restart", WIDTH/2, HEIGHT*3/5);

    window.addEventListener('click',onClick);
    function onClick(){
        document.location.reload();
    }
}



function clearCanvas() {
    ctx.fillStyle="white"
    ctx.fillRect(0,0,WIDTH, HEIGHT)
}



function random_food_postion(min, max){  
    return Math.round(Math.random() * ((max - min)/ squareWidth)) * squareWidth;
}



function get_healthy_food() {
    correctPaintX = random_food_postion(0, WIDTH - squareWidth);
    console.log(correctPaintX)
    correctPaintY = random_food_postion(0, HEIGHT - squareWidth);
    console.log(correctPaintY)

//make sure that the healthy food is not on the player
    player.forEach(function food_on_player (part) {
        const on_player = (part.x == correctPaintX) && (part.y == correctPaintY)
        if (on_player) {
            get_healthy_food()
        }
    });
}



function get_poison_food() {
    wrongPaintX = random_food_postion(0, WIDTH - squareWidth);
    console.log(wrongPaintX)
    wrongPaintY = random_food_postion(0, HEIGHT - squareWidth);
    console.log(wrongPaintY)

//make sure that the poison food is not on the player
    player.forEach(function food_on_player (part) {
        if ((part.x == wrongPaintX) && (part.y == wrongPaintY)) {
           get_poison_food()
        }
   });

//make sure that the poison food is not too close to player
    if ((Math.abs(player[0].x - wrongPaintX) < squareWidth*5 ) || (Math.abs(player[0].y - wrongPaintY) < squareWidth*5)) {
        console.log("too close")
        get_poison_food()
    }

//makesure thatthe poison food is not on the healthy food 
    if ((wrongPaintX == correctPaintX) && (wrongPaintY == correctPaintY)){
        get_poison_food()
    }
}



function drawFood() {
    ctx.fillStyle = GAMECOLOUR["correctPaintColour"];
    ctx.strokestyle = GAMECOLOUR["correctPaintBorderColour"];
    ctx.fillRect(correctPaintX, correctPaintY, squareWidth, squareWidth);
    ctx.strokeRect(correctPaintX, correctPaintY, squareWidth, squareWidth);
    ctx.fillStyle = GAMECOLOUR["wrongPaintColour"];
    ctx.strokestyle = GAMECOLOUR["wrongPaintBorderColour"];
    ctx.fillRect(wrongPaintX, wrongPaintY, squareWidth, squareWidth);
    ctx.strokeRect(wrongPaintX, wrongPaintY, squareWidth, squareWidth);
}



function drawPlayer(){
    player.forEach(drawPlayerPart)
}
function drawPlayerPart(part){
    // Set the colour of the player part
    ctx.fillStyle = GAMECOLOUR["playerColour"];
    // Set the border colour of the player part
    ctx.strokestyle = GAMECOLOUR["playerBorderColour"];
    // Draw a "filled" rectangle to represent the player part at the coordinates
    // the part is located
    ctx.fillRect(part.x, part.y, squareWidth, squareWidth);
    // Draw a border around the player part
    ctx.strokeRect(part.x, part.y, squareWidth, squareWidth);
}



window.addEventListener('keydown', keyDownFunction)
function keyDownFunction(event) {
    //Get the key
    var keyDown = event.key

    // Prevent the snake from reversing
    const goingUp = dy === -squareWidth
    const goingDown = dy === squareWidth
    const goingRight = dx === squareWidth
    const goingLeft = dx === -squareWidth

    //change the direction 
    if ((keyDown === "ArrowLeft" || keyDown === "a") && !goingRight) {
        dx = -squareWidth
        dy = 0
       // setTimeout(keyDownFunction, 100, event)

    }
    if ((keyDown === "ArrowUp" || keyDown === "w") && !goingDown) {
        dx = 0
        dy = -squareWidth
        //setTimeout(keyDownFunction, 100, event)
    }
    if ((keyDown === "ArrowRight" || keyDown === "d") && !goingLeft){
        dx = squareWidth
        dy = 0
        //setTimeout(keyDownFunction, 100, event)
    }
    if ((keyDown === "ArrowDown" || keyDown === "s") && !goingUp) {
        dx = 0
        dy = squareWidth
       //setTimeout(keyDownFunction, 100, event)
    }
}



function move_player() {
    // Create the new player's head
    const head = {x: player[0].x + dx, y: player[0].y + dy};
    // Add the new head to the beginning of snake body
    player.unshift(head);

    const eaten_food = (player[0].x == correctPaintX) && (player[0].y == correctPaintY);
    if (eaten_food) {
        //score
        score += 1;
        document.getElementById('score').innerHTML = "Score: " + score;

        // Generate new food location
        get_healthy_food();
        get_poison_food();
    } else {
        // Remove the last part of snake body
        player.pop();
    }
}



function has_game_ended() {
    //detect if the player hit itself 
    for (let i = 4; i < player.length; i++) {
		if (player[i].x == player[0].x && player[i].y == player[0].y){
		    console.log("hit player")
		    return true
        }
    }
    //detect if the player hit left wall
    if (player[0].x < 0) {
		console.log("hit left wall")
    	return true
    } 
    //d etect if the pplayer hit the right wall
    if (player[0].x + squareWidth > WIDTH) {
		console.log("hit right wall")
        return true
    }
    //detect if the player hit the upper wall
    if (player[0].y  < 0) {
		console.log("hit upper wall")
        return true
    }
    //detect if the player hit the bottom wall
    if (player[0].y + squareWidth > HEIGHT) {
		console.log("hit bottom wall")
        return true
    }
    //detect if the player ate the poison food
    if ((player[0].x == wrongPaintX) && (player[0].y == wrongPaintY)){
		console.log("ate poison food")
        return true
    }
}