

var speed = 300 //number of milleseconds per turn
var paused = true

var square_width = 25;

var canvas_object=document.getElementById("canvas");
var context=canvas_object.getContext("2d");

var width = 1000;
var height = 600;

//40x24 default widthxheight
var grid_height = height/square_width;
var grid_width = width/square_width;

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}


var grid = []
for(var r = 0; r<grid_height; r++){
	grid[r]=[];
	for(var c = 0; c<grid_width; c++){
		grid[r][c]=false;
	}
}
grid[10][10]=true;
grid[10][11]=true;
grid[10][12]=true;
grid[9][12]=true;
grid[8][11]=true;

/*
	This function takes a 2D array as input with each 
	element having values of true or false with true 
	corresponding to white tiles and false corresponding 
	to black tiles
*/
function display(){

	//clears screen 
	context.beginPath();
	context.rect(0, 0, width, height);
	context.fillStyle = "white";
	context.fill();

	//displays rectangles
	for(var r = 0; r<grid.length; r++){
		for(var c = 0; c<grid[0].length; c++){
			if(grid[r][c]){
				context.beginPath();
				context.rect(c*square_width, r*square_width, square_width, square_width);
				context.fillStyle = "black";
				context.fill();
			}
		}
	}
}

function timeStep(){
	//evaluates the rules of the cellular automaton based on the given canvas
	//anything outside of the bounds of the display is considered to be an empty cell
	var next_grid = []
	for(var r = 0; r<grid_height; r++){
		next_grid[r]=[];
		for(var c = 0; c<grid_width; c++){
			next_grid[r][c]=false;
		}
	}	
	canvas.addEventListener('mousedown', function(evt) {
    	var mousePos = getMousePos(canvas, evt);
    
    	x = Math.floor(mousePos.x/square_width);
    	y = Math.floor(mousePos.y/square_width);

    	next_grid[y][x]=true;
    	display();

	}, false);

	function countNeighbors(r,c){
		cnt = 0
		if(r>0)
			cnt+=grid[r-1][c]
		if(r<grid_height-1)
			cnt+=grid[r+1][c]
		if(c>0)
			cnt+=grid[r][c-1]
		if(c<grid_width-1)
			cnt+=grid[r][c+1]
		if(r>0 && c>0)
			cnt+=grid[r-1][c-1]
		if(r>0 && c<grid_width-1)
			cnt+=grid[r-1][c+1]
		if(r<grid_height-1 && c>0)
			cnt+=grid[r+1][c-1]
		if(r<grid_height-1 && c<grid_width-1)
			cnt+=grid[r+1][c+1]
		
		return cnt;
	}

	for(var r = 0; r<grid.length; r++){
		for(var c = 0; c<grid[0].length; c++){
			var neighbor_count = countNeighbors(r,c);
			if(grid[r][c]){//if the cell is alive or black
				if(neighbor_count<2)
					next_grid[r][c]=false;
				else if(neighbor_count>3)
					next_grid[r][c]=false;
				else
					next_grid[r][c]=true;
			}else{
				if(neighbor_count==3)
					next_grid[r][c]=true;
			}

		}
	}
	grid = next_grid;
}


display();
unpaused = true;

function pause(){
	unpaused = !unpaused;
	if(unpaused)
		window.setTimeout(gameLoop,speed);
}	

function gameLoop(){
	timeStep();
	display();
	if(unpaused)
		window.setTimeout(gameLoop,speed);
}

window.setTimeout(gameLoop,speed);
