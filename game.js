/**
* Title: Painter
* Author: Charlie Chen
* Date: 29/07/2022
* Purpose: Design a game
* Reference: https://www.educative.io/blog/javascript-snake-game-tutorial
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
    "obsticlePaintColour": "#7DF9FF", 
    "obsticlePaintBorderColour":"#000000"
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
// The game changeDirections on the interval 
var gameInterval;
// Determines whether to change the direction of the player or not 
// The player move every 100 milliseocnds, therefore the player can only change direction once every 100 milliseonds
var changeDirection
// check if the game has started or not
var gameStarted
// Horizontal velocity of player
var dx = squareWidth;
// Vertical velocity of player
var dy = 0;
// correct-paint x position 
var correctPaintX;
// correct-paint y position 
var correctPaintY;
// obsticle-paint x position 
var obsticlePaintX;
// obsticle-paint y position 
var obsticlePaintY;


// When content loads changeDirection the function startCanvas
window.onload=startCanvas



// This function is the starting screen of the game
function startCanvas(){
    //game hasn't started
    gameStarted = false
    // Return a two dimensional drawing context
    ctx=document.getElementById("myCanvas").getContext("2d")

    // Drawing instruction on the canvas
    clearCanvas();
    ctx.font = "40px comic"
    ctx.fillStyle = "black"
    ctx.textAlign = 'center';
    ctx.fillText("Help the painter to fill the canvas with dark blue paint", WIDTH/2, HEIGHT*3/10);
    ctx.fillText("Avoid the light blue paint", WIDTH/2, HEIGHT*4/10);
    ctx.fillText("Use wsad keys or arrows keys to move", WIDTH/2, HEIGHT*7/10);

    ctx.font = "70px comic"
    ctx.fillText("Click Anywhere to Start", WIDTH/2, HEIGHT*6/10);


    ctx.fillStyle = GAMECOLOUR["correctPaintColour"];
    ctx.strokestyle = GAMECOLOUR["correctPaintBorderColour"];
    ctx.fillRect(940, 210, squareWidth, squareWidth);
    ctx.strokeRect(940, 210, squareWidth, squareWidth);
    ctx.fillStyle = GAMECOLOUR["obsticlePaintColour"];
    ctx.strokestyle = GAMECOLOUR["obsticlePaintBorderColour"];
    ctx.fillRect(720, 290, squareWidth, squareWidth);
    ctx.strokeRect(720, 290, squareWidth, squareWidth);

    // Once click on the starting the screen, the game starts
    window.addEventListener('click', onClick);
    function onClick(){
        if (gameStarted == false){
        StartGame()
        }
    }
}



// This function changeDirections the games 
function StartGame(){ 
    //game started so function onClick() will not work
    gameStarted = true
    console.log("game started")
    // Get the positon of the paint 
    CorrectPaintPosition()
    obsticlePaintPosition()

    // changeDirections the game by making the snake move every 100 milliseconds, and constantly check if it is dying 
    gameInterval = setInterval(()=> {
        if(has_game_ended() == true){
            gameEnd();
        } else {
            changeDirection = true
            clearCanvas();
            drawPaint();
            move_player();
            drawPlayer();
        }
    },100) 
}



// This function is the ending screen of the game
function gameEnd(){
    // Stop the game from changeDirectionning
    clearCanvas(); 
    clearInterval(gameInterval)
    console.log("Game Over")
    
    // Inform the user that the game has ended, and instruction on how to restart
    ctx.font = "90px comic"
    ctx.fillStyle = "black"
    ctx.textAlign = 'center';
    ctx.fillText("Game Over", WIDTH/2, HEIGHT*2/5);
    ctx.fillText("Click Anywhere to Restart", WIDTH/2, HEIGHT*3/5);
    
    window.addEventListener('click',onClick);
    function onClick(){
        document.location.reload();
    }
}



// This function clears the canvas
function clearCanvas() {
    ctx.fillStyle="white"
    ctx.fillRect(0,0,WIDTH, HEIGHT)
}



// Run this function get a random sqaure position on the canvas
function randowPaintPosition(min, max){  
    return Math.round(Math.random() * ((max - min)/ squareWidth)) * squareWidth;
}



// This function gets the position for the correct-paint
function CorrectPaintPosition() {
    // Gets the position for the correct-paint
    correctPaintX = randowPaintPosition(0, WIDTH - squareWidth);
    console.log("correct-paint x position:", correctPaintX)
    correctPaintY = randowPaintPosition(0, HEIGHT - squareWidth);
    console.log("correct-paint y position:", correctPaintY)

    // Make sure that the correct-paint position is not on the player
    player.forEach(function food_on_player (part) {
        const on_player = (part.x == correctPaintX) && (part.y == correctPaintY)
        if (on_player) {
            CorrectPaintPosition()
        }
    });
}



// This function gets the position for the obsticle-paint
function obsticlePaintPosition() {
    // Gets the position for the obsticle-paint
    obsticlePaintX = randowPaintPosition(0, WIDTH - squareWidth);
    console.log("obsticle-paint x poisition:", obsticlePaintX)
    obsticlePaintY = randowPaintPosition(0, HEIGHT - squareWidth);
    console.log("obsticle-paint y poisition:", obsticlePaintY)

    // Make sure that the obsticle-paint position is not on the player
    player.forEach(function food_on_player (part) {
        if ((part.x == obsticlePaintX) && (part.y == obsticlePaintY)) {
           obsticlePaintPosition()
        }
    });

    // Make sure that the obsticle-paint position is not too close to the player, so that the user is capable of avoiding it
    if ((Math.abs(player[0].x - obsticlePaintX) < squareWidth*5 ) || (Math.abs(player[0].y - obsticlePaintY) < squareWidth*5)) {
        console.log("obsticle-paint too close to player")
        obsticlePaintPosition()
    }

    // Make sure that the obsticle-paint position is not the same as the correct-paint position
    if ((obsticlePaintX == correctPaintX) && (obsticlePaintY == correctPaintY)){
        obsticlePaintPosition()
    }
}



// This function draws the paint on the canvas
function drawPaint() {
    ctx.fillStyle = GAMECOLOUR["correctPaintColour"];
    ctx.strokestyle = GAMECOLOUR["correctPaintBorderColour"];
    ctx.fillRect(correctPaintX, correctPaintY, squareWidth, squareWidth);
    ctx.strokeRect(correctPaintX, correctPaintY, squareWidth, squareWidth);
    ctx.fillStyle = GAMECOLOUR["obsticlePaintColour"];
    ctx.strokestyle = GAMECOLOUR["obsticlePaintBorderColour"];
    ctx.fillRect(obsticlePaintX, obsticlePaintY, squareWidth, squareWidth);
    ctx.strokeRect(obsticlePaintX, obsticlePaintY, squareWidth, squareWidth);
}



// This function draws the player
function drawPlayer(){
    player.forEach(drawPlayerPart)
}
// This function draws each part of the player
function drawPlayerPart(part){
    // Set the colour of the player part
    ctx.fillStyle = GAMECOLOUR["playerColour"];
    // Set the border colour of the player part
    ctx.strokestyle = GAMECOLOUR["playerBorderColour"];
    // Draw a "filled" rectangle to represent the player part at the coordinates
    // The part is located
    ctx.fillRect(part.x, part.y, squareWidth, squareWidth);
    // Draw a border around the player part
    ctx.strokeRect(part.x, part.y, squareWidth, squareWidth);
}



// Event listener runs the keyDownFunction every time a key is being pressed
window.addEventListener('keydown', keyDownFunction)
// This function changes the direction of the player 
function keyDownFunction(event) {
    if (changeDirection == true) {
    // Get the key
    var keyDown = event.key

    // Prevent the player from reversing
    const goingUp = dy === -squareWidth
    const goingDown = dy === squareWidth
    const goingRight = dx === squareWidth
    const goingLeft = dx === -squareWidth

    // Change the direction 
    if ((keyDown === "ArrowLeft" || keyDown === "a") && !goingRight) {
        dx = -squareWidth
        dy = 0
        // Prevent the player from changing the direction again before the player changed the direction on the canvas
        changeDirection = false
    }
    if ((keyDown === "ArrowUp" || keyDown === "w") && !goingDown) {
        dx = 0
        dy = -squareWidth
        // Prevent the player from changing the direction again before the player changed the direction on the canvas
        changeDirection = false
    }
    if ((keyDown === "ArrowRight" || keyDown === "d") && !goingLeft){
        dx = squareWidth
        dy = 0
        // Prevent the player from changing the direction again before the player changed the direction on the canvas
        changeDirection = false
    }
    if ((keyDown === "ArrowDown" || keyDown === "s") && !goingUp) {
        dx = 0
        dy = squareWidth
        // Prevent the player from changing the direction again before the player changed the direction on the canvas
        changeDirection = false
    }
    }
}



// This function moves the players based on the direction
function move_player() {
    // Create the new player's head position
    const HEAD = {x: player[0].x + dx, y: player[0].y + dy};
    // Add the new head to the beginning of player's body to move the player
    player.unshift(HEAD);

    // Checks if the correct-paint has being captured
    const getCorrectPaint = (player[0].x == correctPaintX) && (player[0].y == correctPaintY);

    if (getCorrectPaint) {
        // If correct-paint has being captured: increase the score, generate new postion for correct-paint and obsticle-paint
        // Also we don't remove the last sqaure of the player to increase the length of the player (added the new head)
        score += 1;
        document.getElementById('score').innerHTML = "Score: " + score;

        CorrectPaintPosition();
        obsticlePaintPosition();
    } else {
        // if correct-paint hasn't being captured we remove the last square of the player so that the player stay the same length
        player.pop();
    }
}



// This function checks if the player has died
function has_game_ended() {
    // Detects if the player hit itself 
    for (let i = 4; i < player.length; i++) {
		if (player[i].x == player[0].x && player[i].y == player[0].y){
		    console.log("hit player")
		    return true
        }
    }
    // Detects if the player hit left wall
    if (player[0].x < 0) {
		console.log("hit left wall")
    	return true
    } 
    // Detects if the pplayer hit the right wall
    if (player[0].x + squareWidth > WIDTH) {
		console.log("hit right wall")
        return true
    }
    // Detects if the player hit the upper wall
    if (player[0].y  < 0) {
		console.log("hit upper wall")
        return true
    }
    // Detects if the player hit the bottom wall
    if (player[0].y + squareWidth > HEIGHT) {
		console.log("hit bottom wall")
        return true
    }
    // Detects if the player ate the poison food
    if ((player[0].x == obsticlePaintX) && (player[0].y == obsticlePaintY)){
		console.log("obsticle-paint")
        return true
    }
}