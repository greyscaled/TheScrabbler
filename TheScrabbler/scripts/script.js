// GLOBAL VARIABLES ================================================
var ROWS = 7;
var COLUMNS = 7;
//==================================================================

//==================MODEL CLASS=====================================
function Model(){
	// Local Variables
	// testest
	var grid = initGrid(ROWS, COLUMNS); // calls with global vars

	// Fields
	this.grid = grid;   

	// Public Methods  

	//--Static Methods

	//--Instance Methods               

	// Private Methods
	function initGrid(rows, columns) {
		var grid = [];
		for (var i = 0; i < rows; i++) {
			var row = [];
			for (var j = 0; j < columns; j++) {
				row.push("h");
			}
			grid.push(row);
		}
		return grid;
	};

	//console.table(grid);  (TESTING)

} // end of class
//==================================================================

//==================CONTROLLER CLASS================================


function Controller(){
	var canvasID = document.getElementById('canvas');
	canvasID.addEventListener("click",nextState,false);
	var view = new View(canvasID);
	//view(canvasID);
	Model();


	function nextState(e){
		var x_Pos = e.clientX;
		var y_Pos = e.clientY;
		var position = normalize(x_Pos,y_Pos);
		console.log(position.x+","+position.y);

		var letter = prompt("Enter a letter");
		view.addLetter(letter,position.x, position.y);
	}

	function normalize(x_Pos,y_Pos){
		var canvasSize = canvasID.getBoundingClientRect();
		

		var deltaX = (canvasSize.right-canvasSize.left)/COLUMNS;
		var deltaY = (canvasSize.bottom-canvasSize.top)/ROWS;

		// rel_x and rel_y are the grid coordinates starting from (0,0) bottom left
		var rel_x = Math.floor(((x_Pos - canvasSize.left)/(deltaX)));
		var rel_y = Math.floor(((y_Pos + canvasSize.top)/(deltaY)));
		return {x:rel_x,
			y:rel_y};	
	}

	


} // end of Controller class
//==================================================================


//==================VIEW CLASS======================================

function View(canvasID){
	var width =50;  // eventually will be globals
	var height =50;  // designating width of each cell
	
	var ctx = canvasID.getContext('2d');

	// Draws the rectangles
	for(var rows = 0; rows < ROWS; rows++) {
		for (var cols = 0; cols < COLUMNS; cols++) {
			ctx.strokeStyle = "black";
			ctx.fillStyle = "yellow";
			ctx.beginPath();
			ctx.lineWidth = 1;
			ctx.rect(width*rows, height*cols, width, height);
			ctx.closePath();
			ctx.fill();
			ctx.stroke(); 
		}
	}

	this.addLetter = function (letter, row, column) {
		ctx.fillStyle="black";
		ctx.font="25px Georgia";
		ctx.fillText(letter,15+(row*50),35+(column*50));
	};


} // end of View Class

