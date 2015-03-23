var GRID = 7;
function Model(){
	var grid = initGrid();
	this.grid = grid;

	function initGrid() {
		var grid = [];
		for (var i = 0; i < GRID; i++) {
			var row = [];
			for (var j = 0; j < GRID; j++) {
				row.push("");
			}
			grid.push(row);
		}
		return grid;

	};

	console.table(grid);
}

function View(){

	/*
	How to call a function (class) within a function
	Note that the View is being called at the bottom

	var model = new Model();
	model.grid[3][4] = "test";
	console.table(model.grid);

	*/

}

function Controller(){
	
}
View()
