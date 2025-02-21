/*	Narcissa

Aluno 1: 62396 Daniel Ramos <-- mandatory to fill
Aluno 2: 62418 Diogo Carvalho <-- mandatory to fill

Comentario:

Implementámos tudo exceto o modo automático no jogo.

O ficheiro "Narcissa.js" tem de incluir, logo nas primeiras linhas,
um comentário inicial contendo: o nome e número dos dois alunos que
realizaram o projeto; indicação de quais as partes do trabalho que
foram feitas e das que não foram feitas (para facilitar uma correção
sem enganos); ainda possivelmente alertando para alguns aspetos da
implementação que possam ser menos óbvios para o avaliador.

0123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789
*/



// GLOBAL CONSTANTS

const ANIMATION_EVENTS_PER_SECOND = 8;
const SNAKE_INITIAL_BODY_SIZE = 4;
const IS_X_COORD = true;
const IS_Y_COORD = false;


const IMAGE_NAME_EMPTY = "empty";
const IMAGE_NAME_INVALID = "invalid";
const IMAGE_NAME_SHRUB = "shrub";
const IMAGE_NAME_BERRY_BLUE = "berryBlue";
const IMAGE_NAME_BERRY_BROWN = "berryBrown";
const IMAGE_NAME_BERRY_CYAN = "berryCyan";
const IMAGE_NAME_BERRY_GREEN = "berryGreen";
const IMAGE_NAME_BERRY_RED = "berryRed";
const IMAGE_NAME_BERRY_PURPLE = "berryPurple";

const BLACK_COLOR = '#000000';
const IMAGE_NAME_SNAKE_HEAD = "snakeHead";
const IMAGE_NAME_SNAKE_BODY = "snakeBody";


// GLOBAL VARIABLES

let control;	// Try not no define more global variables
let audio;

// ACTORS

class Actor {
	constructor(x, y, imageName) {
		this.x = x;
		this.y = y;
		this.atime = 0;	// This has a very technical role in the control of the animations
		this.imageName = imageName;
		this.show();
	}
	draw(x, y, image) {
		control.ctx.drawImage(image, x * ACTOR_PIXELS_X, y * ACTOR_PIXELS_Y);
	}
	show() {
		this.checkPosition();
		control.world[this.x][this.y] = this;
		this.draw(this.x, this.y, GameImages[this.imageName]);
	}
	hide() {
		control.ctx.clearRect(this.x * ACTOR_PIXELS_X, this.y * ACTOR_PIXELS_Y, ACTOR_PIXELS_X, ACTOR_PIXELS_Y);
		control.world[this.x][this.y] = control.getEmpty();
		this.draw(this.x, this.y, GameImages[IMAGE_NAME_EMPTY]);
	}
	move(dx, dy) {
		this.hide();
		this.x += dx;
		this.y += dy;
		this.show();
	}
	animation(x, y) {
	}

	/**
	 * Returns the amount of points the object should give upon touch.
	 */
	pointsGiven() {
	}

	/**
	 * Returns a boolean value stating if the object is an obstacle or not.
	 */
	isObstacle() {
	}

	checkPosition() {
		if (control.world[this.x] === undefined
			|| control.world[this.x][this.y] === undefined)
			fatalError("Invalid position");
	}

	getX() {
		return this.x;
	}
	getY() {
		return this.y;
	}
}

/**
 * Actors that occupy more than 1 cell extend this class
 * which has a grow method to make them expand.
 */
class MultiCelActor extends Actor{
	constructor(x, y, imageName) {
		super(x,y, imageName);
		this.elements = [];
	}

	pointsGiven() {
	}

	isObstacle() {
	}
	
	grow() {
	}
}

/**
 * Actors that occupy only 1 cell extend this class.
 */
class UniCelActor extends Actor {
	constructor(x,y, imageName) {
		super(x,y, imageName);
	}

	pointsGiven() {
	}

	isObstacle() {
	}
}

class Shrub extends MultiCelActor {
	/**
	 * Initializes the shrub, assign a random value between 20 and 100
	 * so that the shrub knows when to grow.
	 * Fills the elements list with all the adjacent valid cell coordinates
	 * to be used when growing.
	 */
	constructor(x, y, color) {
		super(x, y, IMAGE_NAME_SHRUB);
		this.growthTime = (20 + rand(81)) * ANIMATION_EVENTS_PER_SECOND;
		control.fillAdjacent(this.elements, x, y);
	}

	pointsGiven() {
		return 0;
	}

	isObstacle() {
		return true;
	}

	/**
	 * Reduces the growthTime, if the growthTime reaches 0, it means it's time to
	 *  grow so it calls the grow method and assigns a new random value.
	 */
	animation(x, y) {
		this.growthTime--;
		if (this.growthTime <= 0) {
			this.grow();
			this.growthTime = (20 + rand(81)) * ANIMATION_EVENTS_PER_SECOND;
		}
	}

	/**
	 * Chooses a random cell from the adjacent coordinates, removes that coordinate
	 * from the list and adds its adjacent coordinates.
	 * Places a reference of the object in the world position chosen and draws the 
	 * shrub image in that positon.
	 */
	grow() {
		// Choose a random adjacent cell to grow into
		if (this.elements.length > 0) {
			let index = rand(this.elements.length);
			let randomCell = this.elements[index];
			this.elements.splice(index,1);
			control.fillAdjacent(this.elements, randomCell.x, randomCell.y);
			control.world[randomCell.getX()][randomCell.getY()] = this;
			this.draw(randomCell.getX(), randomCell.getY(), GameImages[IMAGE_NAME_SHRUB]);
		}
	}
}

class Empty extends UniCelActor {
	constructor() {
		super(-1, -1, IMAGE_NAME_EMPTY);
		this.atime = Number.MAX_SAFE_INTEGER;	// This has a very technical role
	}

	pointsGiven() {
		return 0;
	}

	isObstacle() {
		return false;
	}
	show() { }
	hide() { }
}

class Invalid extends UniCelActor {
	constructor(x, y) { super(x, y, IMAGE_NAME_INVALID); }

	pointsGiven() {
		return 0;
	}

	isObstacle() {
		return false;
	}
}


class Berry extends UniCelActor {
	/**
	 * Initializes the life time of the berry with a random number
	 * between 20 and 80 seconds.
	 */
	constructor(x, y, color) {
		super(x, y, color);
		this.lifeTime = (20 + rand(81)) * ANIMATION_EVENTS_PER_SECOND;
	}

	/**
	 * Returns how many points this berry values.
	 */
	pointsGiven() {
		if (this.isSinking())
			return 2;
		return 1;
	}

	isObstacle() {
		return false;
	}

	/**
	 * Checks if the life time of this berry is under 10 seconds.
	 */
	isSinking() {
		return this.lifeTime <= 10 * ANIMATION_EVENTS_PER_SECOND && this.lifeTime >= 0;
	}

	/**
	 * If the berry is sinking it draws a small black circle in the middle of it
	 * and, if the life time is 0, hides it from the world.
	 */
	animation(x, y) {
		this.lifeTime--;
		if (this.isSinking()) {
			control.ctx.fillStyle = "black";
			control.ctx.beginPath();
			control.ctx.arc((x + 0.43) * ACTOR_PIXELS_X, (y + 0.55) * ACTOR_PIXELS_Y, 3, 0, 2 * Math.PI);
			control.ctx.fill();
		}
		if (this.lifeTime == 0) {
			this.hide();
		}
	}
}

class Snake extends MultiCelActor {
	/**
	 * Creates a stomach variable to store colors of the three
	 * berries that were eaten last. A grew variable that says
	 * if the snake has to grow and how many cells, fill the
	 * stomach with the body image for the beggining of the game.
	 * Places the initial coordinate in all the houses of the
	 * elements vector, in order to make the snake grow only
	 * from the moment the player starts walking.
	 */
	constructor(x, y) {
		super(x, y, IMAGE_NAME_SNAKE_HEAD);
		[this.movex, this.movey] = [0, 0];
		this.stomach = new Array(3);
		this.grew = 0;
		for (let i = 0; i < 3; i++) {
			this.stomach[i] = IMAGE_NAME_SNAKE_BODY;
		}
		for (let i = 0; i < SNAKE_INITIAL_BODY_SIZE; i++) {
			let point = new Coordinate(this.x, this.y )
			this.elements.push(point);
		}
	}

	pointsGiven() {
		return 0;
	}

	isObstacle() {
		return true;
	}

	handleKey() {
		let k = control.getKey();
		if (k === null)	// ignore
			;
		else if (typeof (k) === "string")	// special command
			;
		else {	// change direction
			let kx, ky;
			[kx, ky] = k;
			if (kx != -this.movex || ky != -this.movey) {
				this.movex = kx;
				this.movey = ky;
			}
		}
	}


	/**
	 * If the snake position is in the borders of the game, simulates
	 * the pseudo spherical effect.
	 */
	checkPosition() {
		this.x = control.validateSnakePosition(this.x, IS_X_COORD);
		this.y = control.validateSnakePosition(this.y, IS_Y_COORD);
	}
	
	/**
	 * Checks the next position of the snake, if it is an obstacle, then it dies,
	 * if it has a berry, it'll eat the cell, moves the snake(including the body),
	 * and grows if necessary.
	 */
	move(dx, dy) {
		if (dx != 0 || dy != 0) {
			
			let nextX = control.validateSnakePosition(this.x + dx, IS_X_COORD);
			let nextY = control.validateSnakePosition(this.y + dy, IS_Y_COORD);
			if (control.isValidPos(nextX, nextY)) {
			  let cell = control.world[nextX][nextY];
		  
			  if (cell.isObstacle()) {
				this.die();
			  }
		  
			  if (cell.pointsGiven() > 0) {
				this.eatCell(cell);
			  }
			}

			let oldX = this.x;
			let oldY = this.y;

			this.hide();
			this.x += dx;
			this.y += dy;
			this.show();
			if (this.grew > 0) {
				this.grow(oldX,oldY);
				this.grew--;
			} else {
				this.manageBody(oldX,oldY);
			}
			this.drawBody();
		}

	}

	/**
	 * If the berry is already in the stomach, slices the size of the
	 * snake in half, on the contrary, adds the amount of points of 
	 * the cell to the size of the snake, increasing the grew variable
	 * and updating the stomach list with the new color.
	 */
	eatCell(cell) {
		if (this.stomach.some(element => element === cell.imageName)) {
			let sizeToBe = Math.ceil(control.snakeSize * 0.5);
			if (sizeToBe < 5)
				control.snakeSize = 5;

			else
				control.snakeSize = sizeToBe;
			let cellsToDelete = this.elements.length - control.snakeSize + 1; //Somamos 1 para considerar a cabeça no cálculo
			for (let i = 0; i < cellsToDelete; i++) {
				this.clearBodyPart();
			}
		}
		else {
			let points = cell.pointsGiven();
			control.increaseSnake(points);
			this.grew += points;
		}
		if (this.stomach.length == 3)
			this.stomach.pop();
		this.stomach.unshift(cell.imageName);
	}

	/**
	 * clears a body part from the canvas and the world array.
	 */
	clearBodyPart() {
		let left = this.elements.pop();
		control.ctx.clearRect(left.getX() * ACTOR_PIXELS_X, left.getY() * ACTOR_PIXELS_Y, ACTOR_PIXELS_X, ACTOR_PIXELS_Y);
		control.world[left.getX()][left.getY()] = control.getEmpty();
	}
	/**
	 * Controls the snakes movement
	 */
	manageBody(oldX, oldY) {
		this.clearBodyPart();
		this.grow(oldX,oldY);
	}
	
	/**
	 * When called, hides the snake from the world, gives the message "Game Over" and
	 * restarts the game.
	 */
	die() {
		this.hide();
		mesg("Game Over");
		control.restartGame();
	}

	/**
	 * Inserts a new coordinate in the elements array,
	 * draws a snake body in that coordinate and 
	 * places a reference of the object in the world position.
	 */
	grow(x,y) {
		this.elements.unshift(new Coordinate(x, y));
		this.draw(x, y, GameImages[IMAGE_NAME_SNAKE_BODY]);
		control.world[x][y] = this;
	}
	

	/**
	 * Draws the snake body in the corresponding coordinates of the body.
	 */
	drawBody() {
		for (let i = 0; i < 3; i++ ){
			let e = this.elements[i];
			this.draw(e.getX(), e.getY(), GameImages[this.stomach[i]]);
		}
		for (let i = 3; i < this.elements.length; i++) {
			let e = this.elements[i];
			this.draw(e.getX(), e.getY(), GameImages[IMAGE_NAME_SNAKE_BODY]);
		}
	}

	/**
	 * Calls the handleKey method and moves the snake with the
	 * updated values of movex and movey.
	 */
	animation(x, y) {
		this.handleKey();
		this.move(this.movex, this.movey);
	}
}

/**
 * Class that represents a coordinate.
 */
class Coordinate {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}
	
	getX() {
		return this.x;
	}

	getY() {
		return this.y;
	}
}

// GAME CONTROL

class GameControl {

	/**
	 * All the new variables added are above the c variable,
	 * they take care of the timer, score, time left to generate
	 * a berry, the snake size, and if the game is paused.
	 */
	constructor() {
		this.scoreCounter = document.getElementById('score');
		this.timer = document.getElementById('timer');
		this.minutes = 0;
		this.seconds = 0;
		this.snakeSize = 5;
		this.berryGenerationTime = (1 + rand(11)) * ANIMATION_EVENTS_PER_SECOND;
		this.isPaused = false;
		this.colors = [IMAGE_NAME_BERRY_BLUE,IMAGE_NAME_BERRY_BROWN,IMAGE_NAME_BERRY_CYAN,IMAGE_NAME_BERRY_GREEN,IMAGE_NAME_BERRY_PURPLE, IMAGE_NAME_BERRY_RED];
		let c = document.getElementById('canvas1');
		control = this;	// setup global var
		this.key = 0;
		this.time = 0;
		this.ctx = document.getElementById("canvas1").getContext("2d");
		this.empty = new Empty();	// only one empty actor needed, global var
		this.world = this.createWorld();
		this.loadLevel(1);
		this.setupEvents();
	}

	getEmpty() {
		return this.empty;
	}

	/**
	 * Fills the given list with the adjacent coordinates to the ones given, if valid.
	 */
	fillAdjacent(list, x, y) {
		for (let dx = -1; dx <= 1; dx++) {
			for (let dy = -1; dy <= 1; dy++) {
				let newX = x + dx;
				let newY = y + dy;
				if (control.isValidPos(newX, newY) && !control.world[newX][newY].isObstacle() && !this.coordinateBelongs(list, newX, newY)) {
					list.push(new Coordinate(newX, newY));
				}
			}
		}
	}

	/**
	 * Verifies if given coordinate belongs to a list of coordinates.
	 */
	coordinateBelongs(list, x, y) {
		return list.some(coord => coord.getX() === x && coord.getY() === y);
	}

	/**
	 * If the snake position is invalid, adjusts it so the game as a
	 * pseudoesphere motion.
	 */
	validateSnakePosition(e,isX) {
		if (isX && e < 0)
			return 69;
		if (!isX && e < 0)
			return 39;
		else if ((!isX && e > 39) || (isX && e > 69))
			return 0;
		return e;
	}

	/**
	 * Checks if the given position is valid.
	 */
	isValidPos(x, y) {
		return x > -1 && x < 70 && y > -1 && y < 40;
	}

	/**
	 * Increases the snake's score.
	 */
	increaseSnake(points) {
		this.snakeSize += points;
	}

	createWorld() { // matrix needs to be stored by columns
		let world = new Array(WORLD_WIDTH);
		for (let x = 0; x < WORLD_WIDTH; x++) {
			let a = new Array(WORLD_HEIGHT);
			for (let y = 0; y < WORLD_HEIGHT; y++)
				a[y] = this.empty;
			world[x] = a;
		}
		return world;
	}

	loadLevel(level) {
		if (level < 1 || level > MAPS.length)
			fatalError("Invalid level " + level)
		let map = MAPS[level - 1];	// -1 because levels start at 1
		for (let x = 0; x < WORLD_WIDTH; x++)
			for (let y = 0; y < WORLD_HEIGHT; y++) {
				// x/y reversed because map is stored by lines
				GameFactory.actorFromCode(map[y][x], x, y);
			}
	}

	/**
	 * Updates the timer each second.
	 */
	updateTimer() {
		this.seconds++
		if (this.seconds === 60) {
			this.minutes++;
			this.seconds = 0;
		}
		let formattedTime = this.minutes.toString().padStart(2, '0') + ':' + this.seconds.toString().padStart(2, '0');
		this.timer.innerHTML = formattedTime;	
	}	

	getKey() {
		let k = this.key;
		this.key = 0;
		switch (k) {
			case 37: case 79: case 74: return [-1, 0];	// LEFT, O, J
			case 38: case 81: case 73: return [0, -1];	// UP, Q, I
			case 39: case 80: case 76: return [1, 0];	// RIGHT, P, L
			case 40: case 65: case 75: return [0, 1];	// DOWN, A, K
			case 0: return null;
			default: return String.fromCharCode(k);
			// http://www.cambiaresearch.com/articles/15/javascript-char-codes-key-codes
		};
	}

	/**
	 * Stops the game animations and timer.
	 */
	stopTime() {
        if (this.isPaused) {
            clearInterval(this.animationEventIntervalId);
            clearInterval(this.timerIntervalId);
			audio.pause();
            this.isPaused = false;
        }
    }

	/**
	 * Starts the game animations and timer.
	 */
    startTime() {
        if (!this.isPaused) {
            this.animationEventIntervalId = setInterval(() => this.animationEvent(), 1000 / ANIMATION_EVENTS_PER_SECOND);
            this.timerIntervalId = setInterval(() => this.updateTimer(), 1000);
			audio.play();
            this.isPaused = true;
        }
    }

	/**
	 * Restarts the game.
	 */
	restartGame() {
		location.reload();
	}

    setupEvents() {
        addEventListener("keydown", e => this.keyDownEvent(e), false);
        addEventListener("keyup", e => this.keyUpEvent(e), false);
        this.startTime();
    }

	/**
	 * Takes care of the animations, berry generation and checking if the game
	 * was won.
	 */
	animationEvent() {
		this.time++;
		for (let x = 0; x < WORLD_WIDTH; x++)
			for (let y = 0; y < WORLD_HEIGHT; y++) {
				let a = this.world[x][y];
				if (a.atime < this.time) {
					a.atime = this.time;
					a.animation(x, y);
				}
			}
		this.generateBerries();
		this.scoreCounter.textContent = this.snakeSize;
		if(this.snakeSize === 300) {
			mesg("You won!\nTime: " + this.timer.textContent);
			this.restartGame();
		}

	}
	
	keyDownEvent(e) {
		this.key = e.keyCode;
	}

	keyUpEvent(e) {
	}

	/**
	 * When the game reaches the berry generation time, chooses randomly between 1 and
	 * 5 positions to generate new berries.
	 */
	generateBerries() {
		this.berryGenerationTime--;
		if (this.berryGenerationTime == 0) {
			let amount = 1 + rand(5);
			let x, y;
			for (let i = 0; i < amount; i++) {
				let validPos = false;
				let berryColor = rand(6);
				while (validPos == false) {
					x = rand(70);
					y = rand(40);
					if(this.world[x][y] instanceof Empty) {
						validPos = true;
						new Berry(x, y, this.colors[berryColor]);
					}
				}
			}
			this.berryGenerationTime = (1 + rand(11)) * ANIMATION_EVENTS_PER_SECOND;
		}
	}
}


// Functions called from the HTML page

function onLoad() {
	// Asynchronously load the images an then run the game
	GameImages.loadAll(() => new GameControl());
	audio = new Audio("http://ctp.di.fct.unl.pt/lei/lap/projs/proj2223-3/files/resources/louiscole.m4a");
}

function playMusic() {
	audio.play();
}