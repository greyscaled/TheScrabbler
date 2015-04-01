// GLOBAL VARIABLES ================================================
var ROWS = 7;
var COLUMNS = 7;
//==================================================================

//==================MODEL CLASS=====================================
function Model(){
	// Local Variables
	var grid = initGrid(ROWS, COLUMNS); // calls with global vars
	var hl_grid = initGrid(ROWS, COLUMNS);
	// Fields
	this.grid = grid; 
	this.hl_grid = hl_grid;  

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
	// Static Variables
	var canvasID = document.getElementById('canvas');
	var view = new View(canvasID);
	var model = new Model();
	canvasID.addEventListener("click",onGridClick,false);
	var state = "letters";

	// PUBLIC FUNCTIONS 

	// Static Functions
	function onGridClick(e) {
		var x = getClick(e).x;
		var y = getClick(e).y;
		if (state == "letters") {
			inputLetter(x, y);
		
		} else if (state == "highlight") {
			highlight(getLetter(x, y), x, y);
		
		} else {
			// model = new Model();
			// view = new View();
		}
		
	}

	function onNextClick() {

		if (state == "letters") {
			state = "highlight";
		
		} else if (state == "highlight") {
			if (hl_check()) {
				state = "result";
			}
			else {
				// invalid highlighting of cells
				window.alert("Fix your shit");
			}

		} else {
			// reset everything
			model = new Model();
			view = new View();
		}
	}

	function onBackClick() {
		if (state == "highlight"){
			state = "letters";
		} else if (state == "result"){
			state == "highlight";
		}

	}


	
	function highlight(letter, x, y) {
		if (model.hl_grid[y][x] == "H") {

			// deletes highlight in array
			model.hl_grid[y][x] = "";
			console.table(model.hl_grid);

			// deletes highlight but keeps letter
			// in the view
			view.addLetter(letter, x, y);
		
		} else {

			// create highlight in array and view
			view.highlight(letter, x, y);
			model.hl_grid[y][x] = "H";
			console.table(model.hl_grid);
		}
	
	}
	
	function inputLetter(x, y) {

		// will be moved to its own function in due time.
		// quick and dirty check to see if they entered exactly 1 char
		var letter = prompt("Enter a letter.\nEnter nothing to delete a letter.");

		// creating a regular expression and setting it to
		// a var. This regex means from a-z and A-Z it is true
		var aLetters = /[A-Z]|[a-z]/;		

		if (letter != null) {  // cancel returns null
			if (letter == "") {
				view.addLetter(letter, x, y);
				model.grid[y][x] = letter;
			} else {


				if (letter.match(aLetters)){		//If the value has a-z or A-Z in it return true
					if (letter.length == 1) {
						// changing the letters to their uppercase when printing to the view and model
						view.addLetter(letter.toUpperCase(),x, y);
						model.grid[y][x] = letter.toUpperCase(); // note: x/y oppos.
						console.table(model.grid); // TESTING
					} else {
						window.alert("Please select a valid letter");
					}
				} else {
					window.alert("Please select a valid letter");
				}
			}
		}
	}

	

	
	// PRIVATE METHODS

	// Static Method 
	function getLetter(x_Pos, y_Pos) {
		return model.grid[y_Pos][x_Pos];
	}

	function getClick(e){
		var x_Pos = e.clientX;
		var y_Pos = e.clientY;
		var position = normalize(x_Pos,y_Pos);
		console.log(position.x+","+position.y);
		return {x: position.x, y: position.y};
	}

	function normalize(x_Pos,y_Pos){
		var canvasSize = canvasID.getBoundingClientRect();
		

		var deltaX = (canvasSize.right-canvasSize.left)/COLUMNS;
		var deltaY = (canvasSize.bottom-canvasSize.top)/ROWS;

		// rel_x and rel_y are the grid coordinates starting from (0,0) bottom left
		var rel_x = Math.floor(((x_Pos - canvasSize.left)/(deltaX)));
		var rel_y = Math.floor(((y_Pos - canvasSize.top)/(deltaY)));
		return {x:rel_x,
			    y:rel_y
			   };	
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

	this.addLetter = function (letter, x, y) {
		// Clear previous entries
		ctx.clearRect(x*50, y*50, width, height);
		ctx.strokeStyle = "black";
		ctx.fillStyle = "yellow";
		ctx.beginPath();
		ctx.lineWidth = 1;
		ctx.rect(width * x, height *y, width, height);
		ctx.closePath();
		ctx.fill();
		ctx.stroke();

		// Make new entry based on valid input letter
		ctx.fillStyle="black";
		ctx.font="25px Georgia";
		ctx.fillText(letter,(15+(x*50)),35+(y*50));
	};

	this.highlight = function(letter,x,y){
		//Highlight the certain square in the view
		ctx.clearRect(x*50, y*50, width, height);
		ctx.strokeStyle = "black";
		ctx.fillStyle = "blue";
		ctx.beginPath();
		ctx.lineWidth = 1;
		ctx.rect(width * x, height *y, width, height);
		ctx.closePath();
		ctx.fill();
		ctx.stroke();

		ctx.fillStyle="white";
		ctx.font="25px Georgia";
		ctx.fillText(letter,(15+(x*50)),35+(y*50));

	};


} // end of View Class
