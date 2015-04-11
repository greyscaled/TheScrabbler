/**********************************************************************
* 							DATASTUCTURES                             *
***********************************************************************/



var BST=function (){

//EXPECTED: int of the lenght of the string
var Node =function(){
	return{
		left:null,
		right:null,
		values:null,
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
	node.values = new TrieST();
//console.log("do i even "+node.key);
}

if(key<node.key){
	insertREC(node.left,key,value); 
}else if(key>node.key){
	insertREC(node.right,key,value); 
}else{
	if(node.values == undefined){
		node.values = new TrieST();
	}

	node.values.insertWord(value);	

}
},
matchPatternREC=function  (node,key,regExpArray){
//searches to find the node with the key of the value 
//we passed in and will return that NODE
//base case: key= node.key
//if key< node.key use the left child with the same function
//if key> node.key use the right child with the same function
if (node===null){
	return null;
}
if(key<node.key){
	return matchPatternREC(node.left,key,regExpArray); 
}else if(key>node.key){
	return matchPatternREC(node.right,key,regExpArray); 
}else{
	return node.values.matchPattern(regExpArray);
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
	return node.values;
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
search: function (key,word){
//call the recusive method
var val=searchREC(root,key);
if(val ===null){
	return null;
}else{
	return val.search(word);
}
},
isWord: function (key, word) {
	var strN = searchREC(root,key).search(word);
	//console.log(strN)
	if(strN != null){
		return true;
	}else{
		return false;
	}
},
matchesPattern: function (key, regExpArray){
	return matchPatternREC(root,key,regExpArray);
}
};
}
/*************************************************************
*                       Trie Table                          *
*************************************************************/

var TrieST= function(){
	
	var RNode= function(){
		return{
			children:null,
			value:null,
			wordVal:null
		};
	},
	
	root = new RNode();
	root.value = "\0";

	insertWordREC = function(node,wordInput,charAT){
		if(node  ==undefined) {
			node = new RNode();
		}
		if(node.children  == undefined){
			var nodes = [];
			for (var i = 0; i <26; i++) {
				var tempNode = new RNode();
				tempNode.value = String.fromCharCode(i+97);
				nodes.push(tempNode);
			};
			node.children = nodes;
		}

		if(charAT==wordInput.word.length){
			node.wordVal=wordInput; 		
		//console.log("This happens for: "+node.wordVal);
		return true;
	}else{
		var next = wordInput.word.charCodeAt(charAT)-97;
		return insertWordREC(node.children[next],wordInput,charAT+1);
	}
},
searchREC = function(node,wordInput,charAT){
	if(charAT ===wordInput.length && node.wordVal !=null){
		//console.log(node.wordVal);
		return node.wordVal;
	}

	if (node == undefined) { 
		//console.log("pinnggg");
		return null;}

	if(node.value ===null){
		return null;
	}
	if(node.children===null){
		return null;
	}

	if(charAT ===wordInput.length){
		return null;
	}

		var next = wordInput.charCodeAt(charAT)-97;
		if(node.children[next] != undefined){
			return searchREC(node.children[next],wordInput,(charAT+1));
		} else {return null;}
		
	
},
matchPatternREC= function (node,combinations,regExpArray,charAT){
	if(charAT ===regExpArray.length && node.wordVal !=null){
		//console.log("pushh: " + node.wordVal.word);
		combinations.push(node.wordVal);
		return true;
	}
	if(node.value ===null){
		return false;
	}
	if(node.children===null){
		return false;
	}

	if(charAT ===regExpArray.length){
		return false;
	}
	var regExp = new RegExp(regExpArray[charAT]);
	for(var i=0;i< node.children.length;i++){
		var test = (node.children[i].value.match(regExp));
		if(test !=null){
			matchPatternREC(node.children[i],combinations,regExpArray,(charAT+1));
		}

	}
	return false;
}

return {
	insertWord:function(word){
		return insertWordREC(root,word,0);
	},
	search:function(word){
		var test =searchREC(root,word,0);
		return test;
	},
	matchPattern:function(regExArray){
		var combinations = [];
		//console.log(regExArray);
		matchPatternREC(root,combinations,regExArray,0,"");
		//console.table(combinations);
		return combinations;
	}

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

};
