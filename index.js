//====================
// Define

let WIDTH = 50;
let HEIGHT = 50;

let RANDTODIG = 0.2;
let SPEED = RANDTODIG>0.5?10:20

let board = [];

let current = [];

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
	createCanvas(900, 900);
	frameRate(SPEED);

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

	board[y-1][x] = 1

	return {
		"x": x,
		"y": y-1
	}
}
function digDown(coords){
	x = coords.x;
	y = coords.y;

	board[y+1][x] = 1

	return {
		"x": x,
		"y": y+1
	}
}
function digLeft(coords){
	x = coords.x;
	y = coords.y;

	board[y][x-1] = 1

	return {
		"x": x-1,
		"y": y
	}
}
function digRight(coords){
	x = coords.x;
	y = coords.y;

	board[y][x+1] = 1

	return {
		"x": x+1,
		"y": y
	}
}

//====================
// Draw

function draw(){
	for (let i=0; i<HEIGHT; i++){
		for (let j=0; j<WIDTH; j++){
			if (board[i][j] == 1){
				fill(255);
				noStroke();
				rect(j*width/WIDTH, i*height/HEIGHT, width/WIDTH, height/HEIGHT);
			}
		}
	}

	let next = [];
	let currentIter;
	let cell;

	for (let i in current) {
		currentIter = current[i];
		if (checkUp(currentIter)){
			if (Math.random()<RANDTODIG){
				cell = digUp(currentIter);
				next.push(cell);
			} else {
				next.push(currentIter);
			}
		}
		if (checkDown(currentIter)){
			if (Math.random()<RANDTODIG){
				cell = digDown(currentIter);
				next.push(cell);
			} else {
				next.push(currentIter);
			}
		}
		if (checkRight(currentIter)){
			if (Math.random()<RANDTODIG){
				cell = digRight(currentIter);
				next.push(cell);
			} else {
				next.push(currentIter);
			}
		}
		if (checkLeft(currentIter)){
			if (Math.random()<RANDTODIG){
				cell = digLeft(currentIter);
				next.push(cell);
			} else {
				next.push(currentIter);
			}
		}
	}

	current = next;

	if (current.length == 0){
		console.log("Done");
		noLoop();

		//downloadObjectAsJson(board, "export");
		//downloadObjectAsText("fafzagaazg", "export");
	}
}