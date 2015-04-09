// GLOBAL VARIABLES ================================================
var ROWS = 7;
var COLUMNS = 7;
var NUMWORDS = 20;
var ALPHABET = ['a','b','c','d','e','f',
				'g','h','i','j','k','l'
				,'m','n','o','p','q','r'
				,'s','t','u','v','w'
				,'x','y','z'];
//console.log(/agg[eio]\b/.test("aggee")); DIS HOW REGEX WORK
//==================================================================

//==================MODEL CLASS=====================================
function Model() {
	// Local Variables
	var grid = initGrid(ROWS, COLUMNS); // calls with global vars
	var hl_grid = initGrid(ROWS, COLUMNS);
	var words = [];
	var heap = new Heap();
	var tiles = [];

	// Fields
	this.grid = grid;
	this.hl_grid = hl_grid; 
	this.dictionary = getDictionary();
	this.words = words;
	this.heap = heap;
	this.tiles = tiles;
	
	// Public Methods

	/* public Word[] matchTiles()
	 * Creates an array of Words that
	 * can be made from the user's tiles
	 */

	this.hlIndicies = function () {
		var start = findHl();
		console.log(start);
		var indicies = [];
		if (start.d == "vertical") {
			for (var i = start.y; i < ROWS; i++) {
				if (this.hl_grid[i][start.x] == "H" &&
					this.grid[i][start.x] == "") {

					indicies.push(i - start.y);

				}
			}
		} else if (start.d == "horizontal") {
			for (var j = start.x; j < COLUMNS; j++) {
				if (this.hl_grid[start.y][j] == "H" &&
					this.grid[start.y][j] == "") {

					indicies.push(j - start.x);
				}
			}
		}
		console.log(indicies);
		return indicies;
	}

	this.matchTiles = function () {
		var matches = [];
		var temp = this.tiles.slice();
		//var tempheap = this.heap;
		var tempword;
		var index = -1;
		var wildcard = -1;
		var isMatch = false;
		var indicies = this.hlIndicies();
		console.log("INDICIES TO SCAN " + indicies)
		for (var i = 0; i < this.heap.size(); i++) {
			if (this.heap.size() > 0) { //&& isMatch == false) {
				tempword = this.heap.pop();
				temp = this.tiles.slice();
				isMatch = true;
				//console.log("testing " + tempword.word);
				for (var j = 0; j < indicies.length && isMatch; j++) {
					index = temp.indexOf(tempword.word.charAt(indicies[j]));
					//console.log("current stack " + temp);

					if (index == -1) {
						wildcard = temp.indexOf("?");
						if (wildcard == -1) {
							isMatch = false;
						
						} else if (wildcard != -1) {
							temp.splice(wildcard, 1);
							isMatch = true;
						}
					
					} else if (index != -1) {
						//console.log("MATCH! " + index + " " + tempword.word.charAt(indicies[j]));
						temp.splice(index, 1);
						isMatch = true;
					}
					if (j == indicies.length - 1  && isMatch) {
						console.log("matched word: " + tempword.word);
						matches.push(tempword);
					}
				}
			}
		}
		return matches;

	}

	/* public int getResult()
	 * Driver/Stub for now?
	 */
	 this.getResult = function () {
	 	var regExp = /a\w\w\w/g; 
	 	var results = (this.dictionary).matchesPattern(4, regExp);
	 	return results[0].score;
	 };

	/* public String createRegex()
	 *  may later be modified into char[]
	 * @return: regM (regex of highlighted area)
	 */

	 this.createRegex = function() {
	 	var reMain = "";
	 	var reggy = [];
	 	var Direction = findHl();
	 	var count = 0;
		//console.log(Direction);

		// if vertical, create vertical regexs
		if (Direction.d == "vertical") {
			for (var i = 0; i < ROWS; i++) {
				if(this.grid[i][Direction.x] != "") {
					if (this.hl_grid[i][Direction.x] == "H"
						|| adj(i, Direction.x, "vertical")) {

						reMain += this.grid[i][Direction.x];
						count++;
						reggy.push(this.grid[i][Direction.x]);
					}	
			
				} else if(this.hl_grid[i][Direction.x] == "H") {

					if (this.grid[i][Direction.x] == "") {
						reMain+="\\w";
						count++;
						reggy.push("\\w");
					
					} else {
						reMain += this.grid[i][Direction.x];
						count++;
						reggy.push(this.grid[i][Direction.x]);
					}	

				}
			}
		
		} else if (Direction.d == "horizontal") {
			for (var j = 0; j < COLUMNS; j++) {
				if (this.grid[Direction.y][j] != "") {
					if (this.hl_grid[Direction.y][j] == "H"
						|| adj(Direction.y, j, "horizontal")) {

						reMain += this.grid[Direction.y][j];
						reggy.push(this.grid[Direction.y][j]);
						count++;
				
					}
			
				} else if(this.hl_grid[Direction.y][j] == "H") {

					if (this.grid[Direction.y][j] == "") {
						reMain +="\\w";
						reggy.push("\\w");
						count++;

					} else {
						reMain += this.grid[Direction.y][j];
						reggy.push(this.grid[Direction.y][j]);
						count++;
					}
				}
			}
		}
		var regm = this.modifyRegex(Direction.y,Direction.x,Direction.d,reggy);
		//var regm = new RegExp(reMain);
		//console.log(regm);
		//console.log(count);
		//console.log(regm.test("hey"));
		return {key:count, regex:regm};
	};
	
	/* public Word[] getMatches()
	 * @return: array of Words sorted
	 */

	 this.createMatches = function() {
	 	var regex = this.createRegex();
	 	return this.dictionary.matchesPattern(regex.key, regex.regex);

	 }

	 this.sortMatches = function(matches) {
	 	for (var i = 0; i < matches.length; i++) {
	 		this.heap.add(matches[i]);
	 	}


	 }

	 this.getMatches = function (number) {
	 	var result = [];
	 	var N = 0;

	 	if (this.heap.size() >= number) { N = number;}
	 	else {N = this.heap.size();}

	 	for (var i = 0; i < N; i++) {
	 		result.push(this.heap.pop());
	 	}
	 	console.log("this is the result " + result);
	 	return result;
	 }

	
	
	//--Static Methods

	/* private Class Heap
	 * public: size, add, top, pop
	 * private: exch, less, sink, swim
	 */

	 function Heap(){
		// field: words[]
		this.words = ['-'];

		/* public int size()
		 * @return: size of queue
		 */
		 this.size = function() {
		 	return this.words.length - 1;
		 };

		// helper function
		this.exch = function(i,j) {
			var temp = this.words[i];
			this.words[i] = this.words[j];
			this.words[j] = temp;
		};

		// helper function
		this.less = function(i,j) {
			return this.words[i].score < this.words[j].score;
		};

		/* public void add(Object Word)
		 * sorts ADT Word into priqueue/heap
		 */
		 this.add = function(wordADT) {
		 	this.words.push(wordADT);
		 	this.swim(this.words.length -1);
		 };

		/* public Word top()
		 * @return: returns max
		 */
		 this.top = function(){
		 	if (this.size() == 0) {return null;}
		 	else {
		 		var top = this.words[1];
		 		return top;
		 	}

		 };

		/* public Word pop()
		 * @return: returns and deletes max
		 */
		 this.pop = function() {
		 	if (this.size() == 0) {
		 		return null;
		 	}
		 	var max = this.words[1];
		 	
		 	this.exch(1, this.size());
		 	this.words.splice(this.size(), 1);
		 	this.sink(1);
		 	return max;
		 };

		// helper function
		this.sink = function(index){
			var size = this.size();
			while (2*index <= size){
				var j = 2*index;
				if (j< size && this.less(j,j+1)){
					j++;
				}
				if (!this.less(index,j)){
					break;
				}
				this.exch(index,j);
				index = j;
			}
		};

		// helper function
		this.swim = function(index){
			var size = this.size();

			while (index > 1 && this.less(Math.floor(index/2),index)){
				this.exch(Math.floor(index/2),index);
				index = Math.floor(index/2);
			}
		};

	}

	//--Instance Methods               

	// Private Methods

	/* used to grab an array of chars on a line
	   that is perpendicular to the highlight */
	this.grabWord = function(i, j, dir) {
		var word = [];
		if (dir == "horizontal") {
			for (var x = 0; x < j; x++) {
				if( (this.grid[i][x] != ""
					&& this.grid[i][x+1] != "") ||
					(this.hl_grid[i][x+1] == "H")) {
						word.push(this.grid[i][x]);
				
				} else word = []; // reset word if not in a row
			}
			word.push("?");
			for (var x = j; x < COLUMNS; x++) {
				if (this.grid[i][x] != "" && 
					(this.hl_grid[i][x-1] == "H" ||
					this.grid[i][x-1] != "")) {

					word.push(this.grid[i][x]);
				}
			}
		} else if (dir=="vertical") {
			for (var y = 0; y < i; y++) {
				if( (this.grid[y][j] != ""
					&& this.grid[y+1][j] != "") ||
					(this.hl_grid[y+1][j] == "H")) {
						word.push(this.grid[y][j]);
				
				} else word = []; // reset word if not in a row
			}
			word.push("?");
			for (var y = i; y < ROWS; y++) {
				if (this.grid[y][j] != "" && 
					(this.hl_grid[y-1][j] == "H" ||
					this.grid[y-1][j] != "")) {

					word.push(this.grid[y][j]);
				}
			}
			console.log(word);
		}
		return word.join("");
	}

	/* Takes main Regex and modifies it */
	this.modifyRegex = function(i, j, d, reg) {
		var trial = "";
		var letlist = [];
		var newreg = reg;

		console.log("star of highlight: " + i +" "+j);
		console.log("regex length: " + reg.length);
		console.log("Direction: " + d);
		var count = 0;  // for reg index
		if (d == "vertical") {

			// iterate each row looking for perpendicular words
			for (var x = i; x < i + reg.length; x++) { 
				if ( (this.grid[x][j] == "") && // only if \w 
					(this.grid[x][j+1] != ""||  // and adj letter
					this.grid[x][j-1] != "")) {
					
					// check is a string with '?' where highlight is
					var check = this.grabWord(x,j,"horizontal");  // grabs word
					letlist = [];
					// check if each letter of alphabet forms a word
					for (var lett = 0; lett < ALPHABET.length; lett++) {
						trial = check.replace("?",ALPHABET[lett]);
						if (this.dictionary.isWord(trial.length,trial)) {
							letlist.push(ALPHABET[lett]);
						}
					}

					// now modify the actual regex
					var temp = "[";
					for (var let = 0; let < letlist.length; let++) {
						temp += letlist[let];
					}
					temp += "]";
					newreg[count] = temp;
					//console.log(new RegExp(newreg.join("")));
				}
				count++;
			}
			console.log(new RegExp(newreg.join("")+"\\b"));
			return new RegExp(newreg.join("")+"\\b");
		
		} else if (d == "horizontal") {

			for (var y = j; y < j + reg.length; y++) { 
				if ( (this.grid[i][y] == "") && // only if \w 
					( ((i<= ROWS -1) && this.grid[i+1][y] != "")||  // and adj letter
					  (( i > 0) && this.grid[i-1][y] != ""))) {
					
					// check is a string with '?' where highlight is
					var check = this.grabWord(i,y,"vertical");  // grabs word
					letlist = [];
					// check if each letter of alphabet forms a word
					for (var lett = 0; lett < ALPHABET.length; lett++) {
						trial = check.replace("?",ALPHABET[lett]);
						if (this.dictionary.isWord(trial.length,trial)) {
							letlist.push(ALPHABET[lett]);
						}
					}

					// now modify the actual regex
					var temp = "[";
					for (var let = 0; let < letlist.length; let++) {
						temp += letlist[let];
					}
					temp += "]";
					newreg[count] = temp;
					//console.log(new RegExp(newreg.join("")));
				}
				count++;
			}
			console.log(new RegExp(newreg.join("")+"\\b"));
			return new RegExp(newreg.join("")+"\\b");

		}


	}

	// Checks for an adjacent highlight in the same direction
	function adj(i, j, d) {
		if (d == "vertical") {
			if (i < (ROWS - 1) && hl_grid[i+1][j] == "H") {
				return true;

			} else if(i > 0 && hl_grid[i-1][j] == "H") {
				return true;

			} else {
				return false;
			}

		} else if(d == "horizontal") {
			if (j < (COLUMNS - 1) && hl_grid[i][j+1] == "H") {
				return true;

			} else if(j > 0 && hl_grid[i][j-1] == "H") {
				return true;

			} else {
				return false;
			}
		}
	}

	function findHl() {
		// Finds what direction the highlighted cells are
		// returns: d: vertical, horizontal or single 
		// 			as well as start coordinates x, y
		for (var i = 0; i < ROWS; i++) {
			for (var j = 0; j < COLUMNS; j++) {
				if (hl_grid[i][j] == "H") {
					if (i < (ROWS - 1) && hl_grid[i+1][j] == "H") {
						return {d: "vertical", y:i, x:j};

					} else if (j < (COLUMNS - 1) && hl_grid[i][j+1] == "H") {
						return {d:"horizontal", y:i, x:j};

					} else {
						return {d:"single", y:i, x:j};

					}
				}
			}
		}

	}

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
	}

	function getDictionary(){
	//requesting and reading from file and if its found then reading from it
	var bst = new BST();
	var rawFile = new XMLHttpRequest();
	var url = "input/dictionary.txt";
	rawFile.open("GET", url, true);
	rawFile.onreadystatechange = function ()
	{
		if(rawFile.readyState === 4)
		{
			if(rawFile.status === 200 || rawFile.status == 0)
			{
				var allText = rawFile.responseText;
	                //console.log(allText); //TODO make a data structure
	                words = allText.split("\n");

	                for (var i = 0; i <words.length; i++) {
	                	if(words[i].length <=7){
	                		bst.insert(words[i].length,new Word(words[i]));
	                	}	
	                };
	                //console.log("herpa derpa derpa");
	                //console.log(bst.search(5));
	                //bst.print();
	                
	            }
	        }
	    }
	    rawFile.send(null);
	    return bst;
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
	var resetButton = document.getElementById("resetbtn");
	var view = new View(canvasID);
	var model = new Model();
	var state = "letters";
	var form = document.getElementById("tit");

	// Event Listeners
	canvasID.addEventListener("click",onGridClick,false);
	nextButton.addEventListener("click",onNextClick,false);
	backButton.addEventListener("click",onBackClick,false);
	resetButton.addEventListener("click", resetN, false);
	

	// PUBLIC FUNCTIONS 

	//--Static Functions

	/* public void onGridClick(event)
	 * @param e - an HTML click event
	 * Sends click coordinates to other functions
	 */
	function onGridClick(e) {
		var x = getClick(e).x;
		var y = getClick(e).y;
		if (state == "letters") {
			inputLetter(x, y);

		} else if (state == "highlight") {
			highlight(getLetter(x, y).toUpperCase(), x, y);

		} else {
			// model = new Model();
			// view = new View();
		}
		
	}

	/* public void onNextClick()
	 * FSM
	 * Reacts to HTML buttons
	 * uses state string
	 */
	function onNextClick() {

		if (state == "letters") {
			state = "highlight";
			updatePStatus(state);

		} else if (state == "highlight") {
			if (hl_check()) {
				state = "tiles";
				updatePStatus(state);
				model.createRegex();
				window.alert("Please input your tiles");
			
			} else {
				// invalid highlighting of cells
				window.alert("Please select a line");
			}

		} else if (state == "tiles") {
		    findBestWords();
			getTiles();
			if (tileCheck()) {
				state = "result";

			} else {window.alert("error with tiles");}
			


		} else if (state == "result") {
			displayMatches();

		} else { resetN(); }

	}

	/* public void onBackClick()
	 * FSM
	 * Reacts to HTML buttons
	 * uses state string
	 */
	function onBackClick(){
		if (state == "highlight") {
			state = "letters";
			updatePStatus(state);
		
		} else if (state == "tiles") {
			state = "highlight";
			updatePStatus(state);
			model.tiles = [];
		
		} else if (state == "result") {
			state = "tiles";
			updatePStatus(state);
			view.clearResult();
			window.alert("Please input your tiles");
		}
	}

	/* public char[] getTiles()
	 * @return an array of characters representing user's tiles
	 */
	 function getTiles() {
	 		model.tiles = [];
	 	for (var i = 0; i < 7; i++) {
	 		var temp = form.elements[i].value;
	 		if (/[A-Z]|[a-z]/.test(temp)) {temp = temp.toLowerCase();}
	 		model.tiles.push(temp);
	 	}
	 	console.log(model.tiles);
	 }

	 /* public boolean tileCheck()
	  * @return true if input form is filled with valid chars
	  */
	  function tileCheck() {
	  	for (var i = 0; i < 7; i++) {
	  		if (form.elements[i].value == "" ||
	  			form.elements[i].value == null) {
	  			return false;
	  			
	  		} else if (!(/[a-z]\b|[A-Z]\b|\-|\?/.test(
	  			form.elements[i].value))) {
	  			return false;
	  		}
	  	}
	  	return true;
	  }

	/* public void resetN()
	 * refreshes browser
	 * resets all forms and queries
	 * restarts state machine
	 */
	function resetN() {
		location.reload(); // refreshes window
	
		// clears tile entry form
		for (var i = 0; i < 7; i++) { 
			form.elements[i].value = "";
		}
	
	}

	/* public void updatePStatus(String state)
	 * @param: a string representing the current FSM state
	 * Sends state information to view to modify <p id=pstatus>
	 */
	function updatePStatus(state) {
		var s_i = "Click on the grid below and enter letters.  When finished, press next.  If you wish to delete a letter, simply click on it and hit enter.";

		var s_h = "Click the cells of which you would like to form a word from your tiles.  The cells must be adjacent and in a vertical or horizontal line.  When you're done, click next.";

		var s_t = "Enter your tiles. Don't leave any empty.<br>'-' indicates no tile.<br>'?' indicates blank tile.";
		if (state == "letters") {
			view.updatePStatus(s_i);

		} else if (state == "highlight") {
			view.updatePStatus(s_h);
		
		} else if (state == "tiles") {
			view.updatePStatus(s_t);
		}

	}

	/* public void highlight(char letter, int x, int y)
	 * @param: letter is a letter on the grid
	 * @param: x and y are 2D array indicies
	 * highlights or de-highlights a cell on the grid
	 */
	function highlight(letter, x, y) {
		if (model.hl_grid[y][x] == "H") {

			// deletes highlight in array
			model.hl_grid[y][x] = "";
			view.addLetter(letter, x, y);
			//console.table(model.hl_grid);

			// deletes highlight but keeps letter
			// in the view
			

		} else {

			// create highlight in array and view
			view.highlight(letter, x, y);
			model.hl_grid[y][x] = "H";
			//console.table(model.hl_grid);
		}

	}
	
	/* public void inputLetter(int x, int y)
	 * @params: x and y are 2D array indicies
	 * Takes in user letter input to display on the grid
	 */
	function inputLetter(x, y) {

		var letter = prompt("Enter a letter.\nEnter nothing to delete a letter.");

		// creating a regular expression and setting it to
		// a var. This regex means from a-z and A-Z it is true
		var aLetters = /[A-Z]|[a-z]/;		

		if (letter != null) {  // cancel returns null
			if (letter == "") {
				model.grid[y][x] = letter; // do this first
				if (model.hl_grid[y][x] == "H") {
					view.addHLetter(letter, x, y); // keep highlight

				} else {
					view.addLetter(letter, x, y);
				}
				
				
			} else {
				//If the value has a-z or A-Z in it return true
				if (letter.match(aLetters)){		
					if (letter.length == 1) {
						// changing the letters to their uppercase when printing to the view and model
						model.grid[y][x] = letter.toLowerCase();
						if (model.hl_grid[y][x] == "H") {
							view.addHLetter(letter.toUpperCase(), x, y);

						} else {
							view.addLetter(letter.toUpperCase(),x, y);
						}
						
						//console.table(model.grid); // TESTING
					}
				} else {
					window.alert("Please select a valid letter");
				}
			}
		}
	}

	/* public void findBestWords()
	 * 
	 */
	function findBestWords() {
		model.sortMatches(model.createMatches());
		//view.updateResult(model.getMatches(NUMWORDS)); // move later
	}

	function displayMatches () {
		view.updateResult(model.matchTiles());
	}

	
	// PRIVATE METHODS

	//--Static Method 

	// checks if user made proper highlighting pattern
	function hl_check() {
		var count = 0;
		var hlCoords = [];
		
		for(var i = 0; i < ROWS; i++){
			for(var j = 0; j < COLUMNS; j++){
				if (model.hl_grid[i][j] === "H"){
					count++;
					hlCoords.push([i,j]);
				}
			}
		}

		if (count < 1 || count > 7){
			return false;
		
		} else {
			var vertical = true;
			var horizontal = true;

			//horizontal check
			for(var i = 0; i < hlCoords.length; i++){
				
				for (var j = 0; j < hlCoords.length;j++){
					if (hlCoords[i][0] != hlCoords[j][0]){
						horizontal = false;
					}
					
				}
			}
			
			//vertical check
			for(var i = 0; i < hlCoords.length; i++){
				
				for (var j = 0; j < hlCoords.length;j++){
					if (hlCoords[i][1] != hlCoords[j][1]){
						//console.log("poop");
						vertical = false;
					}
				}
			}
			
			if (horizontal == vertical){
				return false;
			}

			if (vertical == true){
				if (hlCoords[hlCoords.length - 1][0] - hlCoords[0][0] + 1 != hlCoords.length){
					return false;
				
				} else {
					return true;
				}

			} 
			if (horizontal == true) {
				
				if (hlCoords[hlCoords.length - 1][1] - hlCoords[0][1] + 1 != hlCoords.length){
					return false;

				} else {
					return true;
				}


			}

		}
	}

	// gets the letter from a position on the 2D grid array
	function getLetter(x_Pos, y_Pos) {
		return model.grid[y_Pos][x_Pos];
	}

	// gets coordinates of a user click on the canvas
	function getClick(e){
		var x_Pos = e.clientX;
		var y_Pos = e.clientY;
		var position = normalize(x_Pos,y_Pos);
		//console.log(position.x+","+position.y);
		return {x: position.x, y: position.y};
	}

	// normalizes the user's click coordinates to the vancas
	function normalize(x_Pos,y_Pos){
		var canvasSize = canvasID.getBoundingClientRect();
		var deltaX = (canvasSize.right-canvasSize.left)/COLUMNS;
		var deltaY = (canvasSize.bottom-canvasSize.top)/ROWS;

		// rel_x and rel_y are the grid coordinates starting from (0,0) bottom left
		var rel_x = Math.floor(((x_Pos - canvasSize.left)/(deltaX)));
		var rel_y = Math.floor(((y_Pos - canvasSize.top)/(deltaY)));
		return {x:rel_x, y:rel_y};	
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

	this.addHLetter = function (letter, x, y) {
		ctx.clearRect(x*50, y*50, width, height);
		ctx.strokeStyle = "black";
		ctx.fillStyle = "blue";
		ctx.beginPath();
		ctx.lineWidth = 1;
		ctx.rect(width * x, height *y, width, height);
		ctx.closePath();
		ctx.fill();
		ctx.stroke();

		// Make new entry based on valid input letter
		ctx.fillStyle="white";
		ctx.font="25px Georgia";
		ctx.fillText(letter,(15+(x*50)),35+(y*50));

	}

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

	this.updatePStatus = function(string) {
		document.getElementById('pstatus').innerHTML = string;
	};

	this.updateResult = function(results) {
		returnstring = "";
		for (var i = 0; i < results.length; i++) {
			temp = results[i];
			returnstring += temp.word
							+ "&emsp;"
							+ temp.score
							+ "<br/>";
		}
		if (returnstring != "") {
			document.getElementById("results").innerHTML = returnstring;
		} else {document.getElementById("results").innerHTML = "No Matches";}


	};

	this.clearResult = function() {
		document.getElementById("results").innerHTML = "";
	}


} // end of View Class
