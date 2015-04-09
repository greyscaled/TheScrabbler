
/**********************************************************************
* 							DATASTUCTURES                             *
***********************************************************************/

var BST=function (){
	//EXPECTED: int of the lenght of the string
	var Node =function(){
	return{
		left:null,
		right:null,
		values:[],
		key: null,
		};
	},

	root = new Node(),


	/*
	PRIVATE METHODS
	*/
	insertREC= function (node, key ,value){
		//if we do not have a node then we will make
		//a new node with a key of key 
		//Then we will check to see if our key is
		//less then (call this method on left child)
		//greater then (call this method to right child)
		//or equal too (add element to our list of values)
		if(node.key === null){
			node.left = new Node();
			node.right = new Node();
			node.key =key;
			node.values.push(value);
			//console.log("do i even "+node.key);
		}

		if(key<node.key){
			insertREC(node.left,key,value); 
		}else if(key>node.key){
			insertREC(node.right,key,value); 
		}else{
			if(node.values == undefined){
				node.values = [value]
			}else{
				node.values.push(value);
			}
			
			
		}
	},

	searchREC=function  (node,key){
		//searches to find the node with the key of the value 
		//we passed in and will return that NODE
		//base case: key= node.key
		//if key< node.key use the left child with the same function
		//if key> node.key use the right child with the same function
		if (node===null){
			return null;
		}
		if(key<node.key){
			return searchREC(node.left,key); 
		}else if(key>node.key){
			return searchREC(node.right,key); 
		}else{
			return node;
		}
	};
	return {
	print: function () {
		console.log(root);
	},
	//PUBLIC METHODS
	//Insert a node into a bst with a specific key and value
	 insert: function (key, value) {
		//call the recusive method
		return insertREC(root,key,value);	
	},

	//find the aproprate node associated with 
	//key and will return that ArrayList
	search: function (key){
		//call the recusive method
		var val=searchREC(root,key);
		if(val==null){
			return null;
		}else{
			return val.values;
		}
	},

	isWord: function (key, regExp) {
		var strN = searchREC(root,key).values;
		for (var i = strN.length -1; i >= 0; i--) {
			if (strN[i].word.match(regExp)) {
				return true;
			}
		}
		return false;
	},

	matchesPattern: function (key, regExp) {
		//var reg = new RegExp(regExp);
		var strLengthN = searchREC(root,key).values;
		//console.table(strLengthN);
		var matches = []; //tempary until we have a heap
		var test = null;
		for (var i = strLengthN.length - 1; i >= 0; i--) {
			//console.log(strLengthN[i].match(regExp));
			test = (strLengthN[i].word.match(regExp));
			if(test != null){
				matches.push(strLengthN[i]);
			}
			
		};
		//console.table(matches);
		return matches;
	},

	
	};
};

/*************************************************************
 *                       ADT                                 *
 *************************************************************/
 var Word= function(word){
 	var scoreRules =function(regEx,intScore) {
 		return{
 			regEX: regEx,
 			score: intScore
 		};
 	},
 	getScore = function(word){
 		var scores = [];
 		scores.push(new scoreRules(/a|e|i|l|n|o|r|s|t|u/,1));
 		scores.push(new scoreRules(/d|g/,2));
 		scores.push(new scoreRules(/b|c|m|p/,3));
 		scores.push(new scoreRules(/f|h|v|w|y/,4));
 		scores.push(new scoreRules(/k/,5));
 		scores.push(new scoreRules(/j|x/,8));
 		scores.push(new scoreRules(/q|z/,10));
 		var score =0;
	 	for (var i = word.length - 1; i >= 0; i--) {
	 		for (var j = scores.length - 1; j >= 0; j--) {
	 			var test = (word[i].match(scores[j].regEX));
				if(test !=null){
					score +=scores[j].score;
				}
	 		};
	 	};
	 	return score;
 	};
 	var wordScore = getScore(word);
 	return {
 		word: word,
 		score: wordScore

 	};
 	
 }
