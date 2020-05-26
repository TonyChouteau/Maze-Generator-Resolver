//====================
// Define

// Matrix
const WIDTH = 50;
const HEIGHT = 50;

// Random & Speed
const RAND_DIG = 0.8;
const RAND_KEEP = 0.9;
const SPEED = 20;

// States
const GENERATING = 0,RESOLVING = 1, END = 2, ERROR = 3;
let state = GENERATING;

// To generate
let board = [];
let current = [];

// To init
let start, end;

// To resolve 
let previous = [];
let closed = [];
let player;

//====================
// Utils

function randInt(min, max) {
	return Math.floor(Math.random() * (max - min) + min);
}

function downloadObjectAsJson(exportObj, exportName){
	var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj));
	var downloadAnchorNode = document.createElement('a');
	downloadAnchorNode.setAttribute("href",     dataStr);
	downloadAnchorNode.setAttribute("download", exportName + ".json");
	document.body.appendChild(downloadAnchorNode);
	downloadAnchorNode.click();
	downloadAnchorNode.remove();
}
function downloadObjectAsText(exportObj, exportName){
	var dataStr = "data:text/plain;charset=utf-8," + encodeURIComponent(exportObj);
	var downloadAnchorNode = document.createElement('a');
	downloadAnchorNode.setAttribute("href",     dataStr);
	downloadAnchorNode.setAttribute("download", exportName + ".txt");
	document.body.appendChild(downloadAnchorNode);
	downloadAnchorNode.click();
	downloadAnchorNode.remove();
}

//====================
// Setup

function setup(){
	let canvas = createCanvas(900, 900);
	canvas.parent("canvas-container");
	frameRate(SPEED);
	noStroke();

	for (let i=0; i<HEIGHT; i++){
		let line = [];
		for (let j=0; j<WIDTH; j++){
			line.push(0);
		}
		board.push(line);
	}

	current.push({
		x: randInt(WIDTH/3,WIDTH*2/3), 
		y: randInt(HEIGHT/3,HEIGHT*2/3)
	});
	board[current[0].y][current[0].x] = 1;
}

//====================
// Check functions

function checkUp(coords){
	x = coords.x;
	y = coords.y;

	if (y-1 < 0 || board[y-1][x] == 1){
		//console.log("x1")
		return false;
	}
	if (y-2 < 0 || board[y-2][x] == 1){
		//console.log("x2")
		return false;
	}
	if (x-1 < 0 || board[y-1][x-1] == 1){
		//console.log("x3")
		return false;
	}
	if (x+1 >= WIDTH || board[y-1][x+1] == 1){
		//console.log("x4")
		return false;
	}

	return true;
}
function checkDown(coords){
	x = coords.x;
	y = coords.y;

	if (y+1 >= HEIGHT || board[y+1][x] == 1){
		//console.log("x1")
		return false;
	}
	if (y+2 >= HEIGHT || board[y+2][x] == 1){
		//console.log("x2")
		return false;
	}
	if (x-1 < 0 || board[y+1][x-1] == 1){
		//console.log("x3")
		return false;
	}
	if (x+1 >= WIDTH || board[y+1][x+1] == 1){
		//console.log("x4")
		return false;
	}

	return true;
}
function checkLeft(coords){
	x = coords.x;
	y = coords.y;

	if (x-1 < 0 || board[y][x-1] == 1){
		//console.log("x1")
		return false;
	}
	if (x-2 < 0 || board[y][x-2] == 1){
		//console.log("x2")
		return false;
	}
	if (y-1 < 0 || board[y-1][x-1] == 1){
		//console.log("x3")
		return false;
	}
	if (y+1 >= HEIGHT || board[y+1][x-1] == 1){
		//console.log("x4")
		return false;
	}

	return true;
}
function checkRight(coords){
	x = coords.x;
	y = coords.y;

	if (x+1 >= WIDTH || board[y][x+1] == 1){
		//console.log("x1")
		return false;
	}
	if (x+2 >= WIDTH || board[y][x+2] == 1){
		//console.log("x2")
		return false;
	}
	if (y-1 < 0 || board[y-1][x+1] == 1){
		//console.log("x3")
		return false;
	}
	if (y+1 >= HEIGHT || board[y+1][x+1] == 1){
		//console.log("x4")
		return false;
	}

	return true;
}
//====================
// Dig functions

function digUp(coords){
	x = coords.x;
	y = coords.y;

	board[y-1][x] = 1;

	return {
		"x": x,
		"y": y-1
	};
}
function digDown(coords){
	x = coords.x;
	y = coords.y;

	board[y+1][x] = 1;

	return {
		"x": x,
		"y": y+1
	};
}
function digLeft(coords){
	x = coords.x;
	y = coords.y;

	board[y][x-1] = 1;

	return {
		"x": x-1,
		"y": y
	};
}
function digRight(coords){
	x = coords.x;
	y = coords.y;

	board[y][x+1] = 1;

	return {
		"x": x+1,
		"y": y
	};
}

//====================
// Draw sub functions

function generate(){

	let next = [];
	let currentIter;
	let cell;

	for (let i in current) {

		currentIter = current[i];
		let keep = randInt(0,4);

		if (keep == 0 && checkUp(currentIter) && Math.random()<RAND_DIG){
				cell = digUp(currentIter);
				next.push(cell);
				if (Math.random())
				next.push(currentIter);
		} else if (keep == 1 && checkDown(currentIter) && Math.random()<RAND_DIG){
				cell = digDown(currentIter);
				next.push(cell);
				next.push(currentIter);
		} else if (keep == 2 && checkRight(currentIter) && Math.random()<RAND_DIG){
				cell = digRight(currentIter);
				next.push(cell);
				next.push(currentIter);
		} else if (keep == 3 && checkLeft(currentIter) && Math.random()<RAND_DIG){
				cell = digLeft(currentIter);
				next.push(cell);
				next.push(currentIter);
		} else {
			if (checkUp(currentIter) || checkDown(currentIter) || checkLeft(currentIter) || checkRight(currentIter)) {
				next.push(currentIter);
			}
		}
	}

	current = next;

	if (current.length == 0){
		console.log("Done");
		state = RESOLVING;
		frameRate(SPEED*5);
		//downloadObjectAsJson(board, "export");
		//downloadObjectAsText("fafzagaazg", "export");
	}
}

function setPoints(){
	let startCell, endCell;

	let i=0;
	while (i < HEIGHT && (startCell == undefined || endCell == undefined)){
		let j=0
		while (j < WIDTH && (startCell == undefined || endCell == undefined)){
			if (startCell == undefined && board[i][j] == 1){
				startCell = {
					"x": j,
					"y": i
				};
			}
			if (endCell == undefined && board[HEIGHT-1-i][WIDTH-1-j] == 1){
				endCell = {
					"x": WIDTH-1-j,
					"y": HEIGHT-1-i
				};
			}
			j++;
		}
		i++;
	}

	return [startCell, endCell];
}

function alreadyGone(list, x, y){
	let previousFiltered = list.filter((value) => {
		if (value.x == x && value.y == y){
			return true;
		} else {
			return false;
		}
	})

	return previousFiltered.length > 0
}

function resolve(){
	if (!alreadyGone(previous, player.x, player.y)){
		previous.push({
			"x": player.x,
			"y": player.y
		});
		board[player.y][player.x] = 2;
	}

	if (board[player.y-1][player.x] != 0 && !alreadyGone(previous, player.x, player.y-1)) {
		player.y -= 1
	} else if (board[player.y+1][player.x] != 0 && !alreadyGone(previous, player.x, player.y+1)) {
		player.y += 1
	} else if (board[player.y][player.x-1] != 0 && !alreadyGone(previous, player.x-1, player.y)) {
		player.x -= 1
	} else if (board[player.y][player.x+1] != 0 && !alreadyGone(previous, player.x+1, player.y)) {
		player.x += 1
	} else {
		closed.push({
			"x": player.x,
			"y": player.y
		});
		board[player.y][player.x] = 3;
		if (board[player.y-1][player.x] != 0 && !alreadyGone(closed, player.x, player.y-1)) {
			player.y -= 1
		} else if (board[player.y+1][player.x] != 0 && !alreadyGone(closed, player.x, player.y+1)) {
			player.y += 1
		} else if (board[player.y][player.x-1] != 0 && !alreadyGone(closed, player.x-1, player.y)) {
			player.x -= 1
		} else if (board[player.y][player.x+1] != 0 && !alreadyGone(closed, player.x+1, player.y)) {
			player.x += 1
		} else {
			console.log("ERROR")
			state = ERROR;
		}
	}

	if (player.x == end.x && player.y == end.y){
		state = END;
	}
}

//====================
// Draw

function draw(){
	for (let i=0; i<HEIGHT; i++){
		for (let j=0; j<WIDTH; j++){
			if (board[i][j] == 1){
				fill(255);
				rect(j*width/WIDTH, i*height/HEIGHT, width/WIDTH, height/HEIGHT);
			}
			if (board[i][j] == 2){
				fill(255, 200, 0);
				rect(j*width/WIDTH, i*height/HEIGHT, width/WIDTH, height/HEIGHT);
			}
			if (board[i][j] == 3){
				fill(255, 150, 0);
				rect(j*width/WIDTH, i*height/HEIGHT, width/WIDTH, height/HEIGHT);
			}
		}
	}
	
	if (state == GENERATING){
		generate();

		// Init to resolve
		if (state != GENERATING){
			[start, end] = setPoints();
			player = start;
		}
	}
	else if (state == RESOLVING) {
		fill(255, 0, 0);
		rect(player.x*width/WIDTH, player.y*height/HEIGHT, width/WIDTH, height/HEIGHT);
		fill(0, 255, 0);
		rect(end.x*width/WIDTH, end.y*height/HEIGHT, width/WIDTH, height/HEIGHT);

		resolve();
	} 
	else if (state == END){
		noLoop();
		fill(255, 0, 0);
		rect(player.x*width/WIDTH, player.y*height/HEIGHT, width/WIDTH, height/HEIGHT);
		fill(0, 255, 0);
		rect(end.x*width/WIDTH, end.y*height/HEIGHT, width/WIDTH, height/HEIGHT);
	}
}