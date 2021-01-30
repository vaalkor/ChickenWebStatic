'use strict'

$(document).ready(onPageReady);

function onPageReady()
{

// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
var width = 512;
var height = 480;
canvas.width = width;
canvas.height = height;
document.getElementById('game').appendChild(canvas);


//LOADING IMAGES------------------//
var startscreen = new Image();
startscreen.src = "images/startscreen.png";
var backgroundImage = new Image();
backgroundImage.src = "images/background.png";
var foregroundImage = new Image();
foregroundImage.src = "images/foreground.png";
var chickenProjectileImage = new Image();
chickenProjectileImage.src = "images/chicken_projectile.png";
var heroImage = new Image();
heroImage.src = "images/rob.png";
var monsterImage = new Image();
monsterImage.src = "images/chicken.png";
var gameOverImage = new Image();
gameOverImage.src = "images/gameover.png";
//---------------------------------//
//Declaring global variables-------//

var gameMusic = new Audio("sounds/gamemusic.mp3");
var deathMusic = new Audio("sounds/sadviolin.mp3");

var deltaTime;

var timeSinceLastSpawn = 0; //I just set this to a massive value to start with..
var timeSinceLastShot = 100000; //Likewise with this one...
var minTimeBetweenShots = 0.5;
var minTimeBetweenSpawns = 2;

var lastX = 1;
var lastY = 1;

var bulletX = 0;
var bulletY = 0;

var chickenSpeed = 75;
var score = 0;
var scoreIncreaseAmount = 10; 
var increaseFactor = 1.025;

var maxEntites = 20;

var isGameOver = false;
var firstTimeRun = true;

var enemies = new Array();
var bullets = new Array();

for(var i=0; i<maxEntites; i++){
	enemies[i] = new character(0,0,75);
	bullets[i] = new character(0,0,300);
}

var hero = new character(width/2, height/2,256);

var keysDown = {};
//---------------------------------//
//---------------------------------//

addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
	if(e.keyCode==32 || e.keyCode==37 || e.keyCode==38 || e.keyCode==39 || e.keyCode==40)
		e.preventDefault();
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);

//constructor function for a 'character' object
function character(x, y,speed){
	this.x = x;
	this.y = y;
	this.speed = speed;
	this.alive = false;
	this.direction = {x: 0, y: 0};
}

//returns the length of a vector
function modulus(x, y)
{
	return Math.sqrt( Math.pow(x,2) +  Math.pow(y,2) );
}

function isCollision(x1, y1, x2, y2, distance){
	if ( x1 <= (x2 + distance) && x2 <= (x1 + distance) && y1 <= (y2 + distance) && y2 <= (y1 + distance) )
		return true;
}

//a long ass function that moves all the objects
function moveObjects()
{   
	bulletX = 0;
	bulletY = 0;
	lastY = 0;
	var shootBullet = false;

	if (38 in keysDown) 
	{ // Player holding up
		hero.y -= hero.speed * deltaTime;
		lastY = -1;
	}
	if (40 in keysDown) 
	{ // Player holding down
		hero.y += hero.speed * deltaTime;
		lastY = 1;
	}
	if (37 in keysDown) 
	{ // Player holding left
		hero.x -= hero.speed * deltaTime;
		lastX = -1;
	}
	if (39 in keysDown) 
	{ // Player holding right
		hero.x += hero.speed * deltaTime;
		lastX = 1;
	} //player pressed W
	if(87 in keysDown)
	{
		bulletY = -1;
		shootBullet = true;
	} //player pressed s
	else if(83 in keysDown)
	{
		bulletY = 1;
		shootBullet = true;
	} //player pressed a
	if(65 in keysDown)
	{
		bulletX = -1;
		shootBullet = true;
	} //player pressed d
	else if(68 in keysDown)
	{
		bulletX = 1;
		shootBullet = true;
	}

	if (shootBullet) 
	{ // Player pressed space bar.... shoot a projectile!
		for(var i=0; i<maxEntites; i++)
		{

			if( !bullets[i].alive && timeSinceLastShot > minTimeBetweenShots)
			{
				timeSinceLastShot = 0;

				bullets[i].alive = true;
				bullets[i].x = hero.x;
				bullets[i].y = hero.y;
				bullets[i].direction.x = bulletX;
				bullets[i].direction.y = bulletY;
				break;
			}
		}
	}

	var enemyX = 0;
	var enemyY = 0;
	//Move all the bullets and chickens
	for(var i=0; i<maxEntites; i++)
	{

		if( bullets[i].alive )
		{
			bullets[i].x = bullets[i].x + bullets[i].direction.x * bullets[i].speed * deltaTime;
			bullets[i].y = bullets[i].y + bullets[i].direction.y * bullets[i].speed * deltaTime;
		}
		if( enemies[i].alive )
		{
			enemyX = hero.x - enemies[i].x;
			enemyY = hero.y - enemies[i].y;
			var length = modulus(enemyX, enemyY);


			enemyX = enemyX/length;
			enemyY = enemyY/length;

			enemies[i].x = enemies[i].x + enemyX * enemies[i].speed * deltaTime;
			enemies[i].y = enemies[i].y + enemyY * enemies[i].speed * deltaTime;
		}

	}	
}

//Test for collisions between bullets and chickens
function checkCollisions()
{
	for(var i=0;i<maxEntites; i++)
	{
		for(var j=0; j<maxEntites; j++)
		{
			if( bullets[i].alive && enemies[j].alive && isCollision(bullets[i].x, bullets[i].y, enemies[j].x, enemies[j].y, 32) )
			{
				bullets[i].alive = false;
				enemies[j].alive = false;

				score += scoreIncreaseAmount;
				scoreIncreaseAmount *= increaseFactor;
			}
		}

		//if an enemy collides with the hero, the game is OVER!
		if(enemies[i].alive && isCollision(hero.x, hero.y, enemies[i].x, enemies[i].y, 32))
		{
			gameMusic.pause();
			deathMusic.load();
			deathMusic.play();
			isGameOver = true;
		}

		if( bullets[i].x < 0 || bullets[i].x > width || bullets[i].y < 0 || bullets[i].y > height)
				bullets[i].alive=false;
	}
}

function spawnNewChickens()
{
	//spawn new chickens!!!
	if(timeSinceLastSpawn > minTimeBetweenSpawns)
	{
		console.log("Going to try spawn a chicken");
		timeSinceLastSpawn = 0;

		for(var i=0; i < maxEntites; i++)
		{
			if(!enemies[i].alive)
			{
				chickenSpeed *= increaseFactor;
				var enemyPosition = generateEnemyPosition( 250 );
				enemies[i].alive = true;
				enemies[i].x = enemyPosition.x;
				enemies[i].y = enemyPosition.y;	
				enemies[i].speed = chickenSpeed;

				break;
			}
		}		
	}	
}

function clampHeroPosition()
{
	if(hero.x < 0)
		hero.x = width;
	else if(hero.x > width)
		hero.x = 0
	if(hero.y < 0)
		hero.y = height;
	else if(hero.y > height)
		hero.y = 0;
}

function generateEnemyPosition(minDistance)
{	
	var xPos = (Math.random() * 2*width) - width;
	var yPos = (Math.random() * 2*height) - height;

	while( isCollision(xPos, yPos, hero.x, hero.y, minDistance) ){
		xPos = (Math.random() * 2*width) - width;
		yPos = (Math.random() * 2*height) - height;
	}

	return {x: xPos, y: yPos};
}


function render() 
{
	if(firstTimeRun)
	{
		ctx.drawImage(startscreen, 0, 0);
	}
	else if(!isGameOver)
	{
		ctx.drawImage(backgroundImage, 0, 0);

		ctx.drawImage(heroImage, hero.x, hero.y);

		for(var i=0; i<maxEntites; i++)
		{
			if(bullets[i].alive)
				ctx.drawImage(chickenProjectileImage, bullets[i].x, bullets[i].y);	
			if(enemies[i].alive)
				ctx.drawImage(monsterImage, enemies[i].x, enemies[i].y);			
		}

		ctx.drawImage(foregroundImage, 0, 0);	

		writeText("Score: " + Math.floor(score));
	}
	else
	{
		ctx.drawImage(gameOverImage, 0, 0);
		writeText("Final Score: " + Math.floor(score), 'middle');
	}
	
}

function writeText(string, align, xOffset, yOffset)
{
	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.font = "24px Helvetica";
	ctx.textAlign = (align || 'left') ;
	ctx.textBaseline = "top";
	ctx.fillText(string, (xOffset || 32), ( yOffset || 32));
}

// Update game state
var update = function () 
{
	if(firstTimeRun)
	{
		if(32 in keysDown)
		{
			resetGame();
			isGameOver = false;
			firstTimeRun=false;
		}
	}
	else if(!isGameOver)
	{
		moveObjects();

		clampHeroPosition();

		checkCollisions();

		spawnNewChickens();		

	}else{
		//pressing space will reset the game...
		if(32 in keysDown)
		{
			resetGame();
			isGameOver = false;
		}
	}
	
}

function resetGame()
{
	for(var i=0; i<maxEntites; i++)
	{
		enemies[i].alive = false;
		bullets[i].alive = false;
	}

	hero.x = width/2;
	hero.y = height/2;

	score = 0;
	chickenSpeed = 75;
	scoreIncreaseAmount = 10;

	deathMusic.pause();
	gameMusic.load();
	gameMusic.play();
}

// The main game loop
var main = function () {

		var now = Date.now();
		deltaTime = (now - then)/1000;

		timeSinceLastShot += deltaTime;
		timeSinceLastSpawn += deltaTime;

		update();
		render();

		then = now;

		requestAnimationFrame(main);	
};

// Cross-browser support for requestAnimationFrame
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

// Let's play this game!

var then = Date.now();
main();



}
