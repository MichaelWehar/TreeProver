// Description: A limited implementation of unification to construct the intersection of two formulas.
// Author: Michael Wehar
// Date: 3/6/16


function copyFormula(formula, copy){
	if(formula.isVariable){
		copy.isVariable = true;
		copy.text = formula.text;
	}
	else{
		copy.isVariable = false;
		copy.text = formula.text;
		copy.children = [];
		for(var i=0; i<formula.children.length; i++){
			copy.children[i] = {};
			copyFormula(formula.children[i], copy.children[i]);
		}
	}
}


// Labelling Functions
function relabelVariables(formula1, formula2){
	var map1 = {};
	startRelabel("1", map1, formula1);
	var map2 = {};
	startRelabel("2", map2, formula2);
}

function relabel(formula){
	var map = {};
	startRelabel("", map, formula);
}

function startRelabel(prefix, map, formula){
	if(formula.isVariable){
		if(map[formula.text] != null){
			formula.text = map[formula.text];
		}
		else{
			map[formula.text] = prefix + getName(Object.keys(map).length);
			formula.text = map[formula.text];
		}
	}
	else{
		for(var i=0; i<formula.children.length; i++){
			startRelabel(prefix, map, formula.children[i]);
		}
	}
}

function getName(value){
	var name = "";
	var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	
	while(value >= 26){
		name = alphabet.charAt(value%26) + name;
		value = Math.floor(value/26);
	}
	name = alphabet.charAt(value) + name;
	
	return name;
}


// Substitution Functions
function substitute(subformula, variable, formula){
	if(formula.isVariable){
		if(formula.text == variable){
			if(subformula.isVariable) formula.text = subformula.text;
			else{
				formula.isVariable = false;
				formula.text = subformula.text;
				formula.children = subformula.children;
			}
		}
	}
	else{
		for(var i=0; i<formula.children.length; i++){
			substitute(subformula, variable, formula.children[i]);
		}
	}
}

function isFound(variable, formula){
	if(formula.isVariable){
		if(formula.text == variable) return true;
	}
	else{
		for(var i=0; i<formula.children.length; i++){
			if(isFound(variable, formula.children[i])) return true;
		}
	}
	
	return false;
}


// Main Functions
function intersect(formula1, formula2){
	
	var x = {};
	var y = {};
	copyFormula(formula1, x);
	copyFormula(formula2, y);
	
	relabelVariables(x,y);
	if(!traverse(x,y,x,y)) return "empty";
	
	var z = {};
	copyFormula(x,z);
	relabel(z);
	
	return z;
}

function traverse(formula1, formula2, temp1, temp2){
	
	if(temp1.isVariable && temp2.isVariable){
		if(temp1.text != temp2.text){
			//substitute(temp1, temp2.text, formula1);
			substitute(temp1, temp2.text, formula2);
		}
	}
	else if(temp2.isVariable){
		if(isFound(temp2.text, temp1)) return false;
		//substitute(temp1, temp2.text, formula1);
		substitute(temp1, temp2.text, formula2);
	}
	else if(temp1.isVariable){
		if(isFound(temp1.text, temp2)) return false;
		substitute(temp2, temp1.text, formula1);
		//substitute(temp2, temp1.text, formula2);
	}
	else if(temp1.text != temp2.text) return false;
	else{
		for(var i=0; i<temp1.children.length; i++){
			if(!traverse(formula1, formula2, temp1.children[i], temp2.children[i])) return false;
		}
	}
	
	return true;
}


// Printing Functions
function toString(formula){
	var output;
	
	if(formula.isVariable || formula.children.length == 0) output = formula.text;
	else{
		
		output = formula.text + "(" + toString(formula.children[0]);
		for(var i=1; i<formula.children.length; i++){
			output = output + "," + toString(formula.children[i]);
		}
		output = output + ")";
	}
	
	return output;
}

function toStringAlt(formula){
	var output;
	
	if(formula.isVariable || formula.children.length == 0) output = formula.text;
	else{
		if(formula.children.length == 1){
			output = formula.text + toStringAlt(formula.children[0]);
		}
		else if(formula.children.length == 2){
			output = "(" + toStringAlt(formula.children[0]) + formula.text + toStringAlt(formula.children[1]) + ")";
		}
		else{
			output = formula.text + "(" + toStringAlt(formula.children[0]);
			for(var i=1; i<formula.children.length; i++){
				output = output + "," + toStringAlt(formula.children[i]);
			}
			output = output + ")";
		}
	}
	
	return output;
}

function toStringAltHighlight(formula){
	if(formula.isVariable == false && formula.children.length == 2)
		return toStringAlt(formula.children[0]) + " <b style='color: blue;'>" + formula.text + "</b> " + toStringAlt(formula.children[1]);
	else
		return toStringAlt(formula);
}