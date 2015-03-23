// GLOBAL VARIABLES ================================================
var ROWS = 7;
var COLUMNS = 7;
//==================================================================

//==================MODEL CLASS=====================================
function Model(){
	// Local Variables
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
				row.push("");
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
	View();
	Model();
} // end of Controller class
//==================================================================


//==================VIEW CLASS======================================

function View(){
	var width =50;  // eventually will be globals
	var height =50;  // designating width of each cell
	var canvasID = document.getElementById('canvas');
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

} // end of View Class


