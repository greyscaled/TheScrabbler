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
	var width =100;
	var height =80;
	var canvasID = document.getElementById('canvas');
	var ctx = canvasID.getContext('2d');

	// how to draw to the canvas
	for(var i=0;i<GRID;i++){
	ctx.strokeStyle = "blue";	 
	ctx.fillStyle = "red";		
	ctx.beginPath();	// have to have this begin path thing
	
	ctx.lineWidth = 2;
	ctx.rect(100+ width*i,50+ width*i,width,width);
	//ctx.lineTo(100+width*i,500);
	ctx.closePath();

	ctx.fill();
	ctx.stroke(); 
}
	//

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
