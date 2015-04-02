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
	this.dictionary = getDictionary();
	
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
	function getDictionary(){
	//requesting and reading from file and if its found then reading from it
	    var rawFile = new XMLHttpRequest();
	    rawFile.open("GET", "http://localhost/Scrabbler/input/dictionary.txt", false);
	    rawFile.onreadystatechange = function ()
	    {
	        if(rawFile.readyState === 4)
	        {
	            if(rawFile.status === 200 || rawFile.status == 0)
	            {
	                var allText = rawFile.responseText;
	                alert(allText); //TODO make a data structure
	            }
	        }
	    }
	    rawFile.send(null);
	}

	//console.table(grid);  (TESTING)

} // end of class
//==================================================================

//==================CONTROLLER CLASS================================


function Controller(){
	// Static Variables
	var canvasID = document.getElementById('canvas');
	var nextButton = document.getElementById("nextbtn");
	var backButton = document.getElementById("backbtn");
	var view = new View(canvasID);
	var model = new Model();
	var state = "letters";

	// Event Listeners
	canvasID.addEventListener("click",onGridClick,false);
	nextButton.addEventListener("click",onNextClick,false);
	backButton.addEventListener("click",onBackClick,false);
	

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

	// determines what state will be travelled to once
	// the Next button is pressed
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

	// determines what state will be travelled to once
	// the Back button is pressed
	function onBackClick(){
		if (state == "highlight"){
			state = "letters";
		}
		else if (state == "result"){
			state = "highlight";
		}

	}

	// checks to see if the proper highlighting has happened,
	// warns user if they have highlighted incorrectly
	// go from top row to the right and down, row by row,
	// when the first "H" is found look both bellow and
	// to the right of it. If there are elements in both
	// directions return false, otherewise keep going
	// in that direction until there is no "H" (a gap)
	// then compare hCount with hCheckCount. If there is a difference
	// return false


	this.hl_check = function hl_check(){
		var hCount = 0;
		var hCheckCount = 0;
		
		for (i = 0; i< COLUMNS; i++){
			for (j = 0; j < ROWS; j++){
				if (model.hl_grid[j][i] == "H"){
					hCount++;
				}
			}
		}
		
		if (hCount < 1 || hCount > 7) {
			window.alert("You must highlight 1 to 7 squares");
			return false;
		} else{

			for (var i = 0; i< COLUMNS; i++){
				for (var j = 0; j < ROWS; j++){
					if (model.hl_grid[j][i] === "H"){
						hCheckCount++;
					}	
				}
			}
		}
		console.log(hCount);
		// TODOfix the issue where the log count is being erased every time the next state is entered
		return true;
	}


	
	function highlight(letter, x, y) {
		if (model.hl_grid[y][x] == "H") {

			// deletes highlight in array
			model.hl_grid[y][x] = "";
			view.addLetter(letter, x, y);
			console.table(model.hl_grid);

			// deletes highlight but keeps letter
			// in the view
			
		
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
					} else{window.alert("Please select a valid letter");}
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
