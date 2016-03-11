/*! Bing Search Helper v1.0.0 - requires jQuery v1.7.2 */
/* Modified by Michael Wehar */

	var currentNode1 = null;
	var currentNode2 = null;
	var tree = {children: []};
	
	loadSample1();
	
	function highlightNodes(parent1, parent2, parent1Str, parent2Str, formulaStr){
		reset();
		currentNode1 = parent1;
		currentNode2 = parent2;
		$(parent1.contentImg).find("img").attr("src", "img/red.png");
		$(parent2.contentImg).find("img").attr("src", "img/red.png");
		
		$("#formula1").html(parent1Str);
		$("#formula2").html(parent2Str);
		$("#formula3").html(formulaStr);
	}
	
	function activate(node){		
		if(currentNode1 != null && currentNode2 != null) reset();
		if(currentNode1 == null){
			currentNode1 = node;
			$(node.contentImg).find("img").attr("src", "img/blue.png");
			
			var copy = {};
			copyFormula(node.formulaContent, copy);
			var map = {};
			startRelabel("<sub>1</sub>", map, copy);
			var tempStr = toStringAltHighlight(copy);
			
			$("#formula1").html(tempStr);
		}
		else if(currentNode2 == null){
			$(currentNode1.contentImg).find("img").attr("src", "img/red.png");
			currentNode2 = node;
			$(node.contentImg).find("img").attr("src", "img/red.png");
			
			var tempFormula = {isVariable: false, text: "->", children: []};
			tempFormula.children[0] = node.formulaContent;
			tempFormula.children[1] = {isVariable: true, text: "3SPECIAL"};
			var result = intersect(currentNode1.formulaContent, tempFormula);
			
			if(result != "empty"){
				relabel(result.children[1]);
				addChild("formula", result.children[1], currentNode1, currentNode2);
				$("#formula3").html(toStringAltHighlight(result.children[1]));
			}
			else{
				addChild("empty", "empty", currentNode1, currentNode2);
				$("#formula3").html("Empty");
			}
		}
	}
	
	function reset(){
		resetColor(currentNode1);
		resetColor(currentNode2);
		$("#formula1").html("");
		$("#formula2").html("");
		$("#formula3").html("");
		currentNode1 = null;
		currentNode2 = null;
	}
	
	function resetColor(node){
		if(node != null){
			if(node.type == "axiom") $(node.contentImg).find("img").attr("src", "img/green.png");
			else $(node.contentImg).find("img").attr("src", "img/orange.png");
		}
	}
	
	function addChild(type, formula, parent1, parent2){
		if(type == "axiom"){
			
			var linkImg = document.createElement('a');
			var tempImg = document.createElement('img');
			$(tempImg).addClass('icons');
			tempImg.width = 13;
			tempImg.src = "img/green.png";
			
			var tempA = document.createElement('a');
			$(tempA).addClass("items");
			tempA.href = "javascript: return false;";
			tempA.onclick = function(){ reset(); };
			$(tempA).append(toStringAltHighlight(formula));
			
			var index = tree.children.length;
			tree.children[index] = {active: true, type: "axiom", formulaContent: formula, remove: "", contentImg: linkImg, content: tempA, children:[]};
			var x = tree.children[index];
			
			linkImg.href = 'javascript:return false;';
			$(linkImg).append(tempImg);
			linkImg.onclick = function(){ activate(x, tempImg); };
			
		}
		else if(type == "formula"){
			
			var r = document.createElement('a');
			
			var linkImg = document.createElement('a');
			var tempImg = document.createElement('img');
			$(tempImg).addClass('icons');
			tempImg.width = 13;
			tempImg.src = "img/orange.png";
			
			var tempA = document.createElement('a');
			$(tempA).addClass("items");
			tempA.href = "javascript: return false;";
			
			var copy1 = {};
			var copy2 = {};
			copyFormula(parent1.formulaContent, copy1);
			copyFormula(parent2.formulaContent, copy2);
			var map1 = {};
			var map2 = {};
			startRelabel("<sub>1</sub>", map1, copy1);
			startRelabel("<sub>2</sub>", map2, copy2);
			
			var tempStr1 = toStringAltHighlight(copy1);
			var tempStr2 = toStringAltHighlight(copy2);
			
			$("#formula1").html(tempStr1);
			$("#formula2").html(tempStr2);
			
			var tempStr3 = toStringAltHighlight(formula);
			tempA.onclick = function(){highlightNodes(parent1, parent2, tempStr1, tempStr2, tempStr3);};
			$(tempA).append(tempStr3);
				
			var index = parent1.children.length;
			parent1.children[index] = {active: true, type: "formula", formulaContent: formula, remove: r, contentImg: linkImg, content: tempA, children:[]};
			var x = parent1.children[index];
			
			r.href = 'javascript:return false;';
			$(r).append('<img width="10" class="icons" src="img/remove.png">');
			r.onclick = function(){ reset(); x.active = "false"; drawTree(); };
			
			linkImg.href = 'javascript:return false;';
			$(linkImg).append(tempImg);
			linkImg.onclick = function(){ activate(x, tempImg); };

		}
		else{
				
			var r = document.createElement('a');
			
			var linkImg = document.createElement('a');
			var tempImg = document.createElement('img');
			$(tempImg).addClass('icons');
			tempImg.width = 13;
			tempImg.src = "img/orange.png";
			
			var tempA = document.createElement('a');
			$(tempA).addClass("items");
			tempA.href = "javascript: return false;";
			
			var copy1 = {};
			var copy2 = {};
			copyFormula(parent1.formulaContent, copy1);
			copyFormula(parent2.formulaContent, copy2);
			var map1 = {};
			var map2 = {};
			startRelabel("<sub>1</sub>", map1, copy1);
			startRelabel("<sub>2</sub>", map2, copy2);
			
			var tempStr1 = toStringAltHighlight(copy1);
			var tempStr2 = toStringAltHighlight(copy2);
			
			$("#formula1").html(tempStr1);
			$("#formula2").html(tempStr2);
			
			var tempStr3 = "Empty";
			tempA.onclick = function(){highlightNodes(parent1, parent2, tempStr1, tempStr2, tempStr3);};
			$(tempA).append("Empty");
				
			var index = parent1.children.length;
			parent1.children[index] = {active: true, type: "empty", formulaContent: "Empty", remove: r, contentImg: linkImg, content: tempA, children:[]};
			var x = parent1.children[index];
			
			r.href = 'javascript:return false;';
			$(r).append('<img width="10" class="icons" src="img/remove.png">');
			r.onclick = function(){ reset(); x.active = "false"; drawTree(); };
			
			linkImg.href = 'javascript:return false;';
			$(linkImg).append(tempImg);
			linkImg.onclick = function(){ return false; };
			
		}

		drawTree();
	}

	function drawTree(){
		
		$('#tree').empty();
		
		var tempTable = document.createElement('table');
		$(tempTable).addClass("entries");
		
		for(var i=0; i<tree.children.length; i++){
			if(tree.children[i].active == true){
				var tempTr = document.createElement('tr');
				var tempTd = document.createElement('td');
				
				traverseTree(tree.children[i], tempTd);
				$(tempTr).append(tempTd);
				$(tempTable).append(tempTr);
			}
		}
		
		$('#tree').append(tempTable);
	}
	
	function traverseTree(node, tag){
		var tempP = document.createElement('p');
		$(tempP).append('&nbsp;', node.contentImg, '&nbsp;', node.content, '&nbsp;&nbsp;', node.remove);

		var tempTable = document.createElement('table');
		$(tempTable).addClass("entries");

		for(var i=0; i<node.children.length; i++){
			if(node.children[i].active == true){
				var tempTr = document.createElement('tr');
				var tempTd = document.createElement('td');
				
				traverseTree(node.children[i], tempTd);
				$(tempTr).append(tempTd);
				$(tempTable).append(tempTr);
			}
		}
		
		$(tag).append(tempP, tempTable);
	}
	
	function loadSample1(){
		// Frege's axiom system
		
		reset();
		tree = {children: []};

		// formula 1: A -> (B -> A)
		var formula1 = {isVariable: false, text: "->", children: []};
		formula1.children[0] = {isVariable: true, text: "A"};
		formula1.children[1] = {isVariable: false, text: "->", children: []};
		
		formula1.children[1].children[0] = {isVariable: true, text: "B"}
		formula1.children[1].children[1] = {isVariable: true, text: "A"};
		
		// formula 2: (A -> (B -> C)) -> ((A -> B) -> (A -> C))
		var formula2 = {isVariable: false, text: "->", children: []};
		formula2.children[0] = {isVariable: false, text: "->", children: []};
		formula2.children[0].children[0] = {isVariable: true, text: "A"};
		
		formula2.children[0].children[1] = {isVariable: false, text: "->", children: []};
		formula2.children[0].children[1].children[0] = {isVariable: true, text: "B"};
		formula2.children[0].children[1].children[1] = {isVariable: true, text: "C"};
		
		formula2.children[1] = {isVariable: false, text: "->", children: []};
		formula2.children[1].children[0] = {isVariable: false, text: "->", children: []};
		formula2.children[1].children[0].children[0] = {isVariable: true, text: "A"};
		formula2.children[1].children[0].children[1] = {isVariable: true, text: "B"};
		
		formula2.children[1].children[1] = {isVariable: false, text: "->", children: []};
		formula2.children[1].children[1].children[0] = {isVariable: true, text: "A"};
		formula2.children[1].children[1].children[1] = {isVariable: true, text: "C"};
		
		// formula 3: (A -> B) -> (~B -> ~A)
		var formula3 = {isVariable: false, text: "->", children: []};
		formula3.children[0] = {isVariable: false, text: "->", children: []};
		formula3.children[0].children[0] = {isVariable: true, text: "A"};
		formula3.children[0].children[1] = {isVariable: true, text: "B"};
		
		formula3.children[1] = {isVariable: false, text: "->", children: []};
		formula3.children[1].children[0] = {isVariable: false, text: "~", children: []};
		formula3.children[1].children[0].children[0] = {isVariable: true, text: "B"};
		
		formula3.children[1].children[1] = {isVariable: false, text: "~", children: []};
		formula3.children[1].children[1].children[0] = {isVariable: true, text: "A"};
		
		// formula 4: ~~A -> A
		var formula4 = {isVariable: false, text: "->", children: []};
		formula4.children[0] = {isVariable: false, text: "~", children: []};
		formula4.children[0].children[0] = {isVariable: false, text: "~", children: []};
		formula4.children[0].children[0].children[0] = {isVariable: true, text: "A"}
		formula4.children[1] = {isVariable: true, text: "A"};
		
		// formula 5: A -> ~~A
		var formula5 = {isVariable: false, text: "->", children: []};
		formula5.children[0] = {isVariable: true, text: "A"};
		formula5.children[1] = {isVariable: false, text: "~", children: []};
		formula5.children[1].children[0] = {isVariable: false, text: "~", children: []};
		formula5.children[1].children[0].children[0] = {isVariable: true, text: "A"}
		
		// Add axioms to the tree
		addChild("axiom", formula1, null, null);
		addChild("axiom", formula2, null, null);
		addChild("axiom", formula3, null, null);
		addChild("axiom", formula4, null, null);
		addChild("axiom", formula5, null, null);
		
		drawTree();
	}
	
	function loadSample2(){
		// Lukasiewicz's first axiom system
		
		reset();
		tree = {children: []};

		// formula 1: (A->B) -> ((B->C)->(A->C))
		var formula1 = {isVariable: false, text: "->", children: []};
		formula1.children[0] = {isVariable: false, text: "->", children: []};
		formula1.children[0].children[0] = {isVariable: true, text: "A"};
		formula1.children[0].children[1] = {isVariable: true, text: "B"};
		
		formula1.children[1] = {isVariable: false, text: "->", children: []};
		formula1.children[1].children[0] = {isVariable: false, text: "->", children: []};
		formula1.children[1].children[0].children[0] = {isVariable: true, text: "B"};
		formula1.children[1].children[0].children[1] = {isVariable: true, text: "C"};
		
		formula1.children[1].children[1] = {isVariable: false, text: "->", children: []};
		formula1.children[1].children[1].children[0] = {isVariable: true, text: "A"};
		formula1.children[1].children[1].children[1] = {isVariable: true, text: "C"};
		
		// formula 2: (~A->A) -> A
		var formula2 = {isVariable: false, text: "->", children: []};
		formula2.children[0] = {isVariable: false, text: "->", children: []};
		formula2.children[0].children[0] = {isVariable: false, text: "~", children: []};
		formula2.children[0].children[0].children[0] = {isVariable: true, text: "A"}
		
		formula2.children[0].children[1] = {isVariable: true, text: "A"};
		formula2.children[1] = {isVariable: true, text: "A"};
		
		// formula 3: A -> (~A->B)
		var formula3 = {isVariable: false, text: "->", children: []};
		formula3.children[0] = {isVariable: true, text: "A"};
		formula3.children[1] = {isVariable: false, text: "->", children: []};
		
		formula3.children[1].children[0] = {isVariable: false, text: "~", children: []};
		formula3.children[1].children[0].children[0] = {isVariable: true, text: "A"}
		formula3.children[1].children[1] = {isVariable: true, text: "B"};
		
		// Add axioms to the tree
		addChild("axiom", formula1, null, null);
		addChild("axiom", formula2, null, null);
		addChild("axiom", formula3, null, null);
		
		drawTree();
	}
	
	function loadSample3(){
		// Lukasiewicz and Tarski's axiom system
		
		reset();
		tree = {children: []};
		
		// formula 1: ((A -> (B->A)) -> (((~C -> (D->~E)) -> ((C -> (D->F)) -> ((E->D) -> (E->F)))) -> G)) -> (H->G)
		var formula1 = {isVariable: false, text: "->", children: []};
		formula1.children[0] = {isVariable: false, text: "->", children: []};
		formula1.children[0].children[0] = {isVariable: false, text: "->", children: []};
		formula1.children[0].children[0].children[0] = {isVariable: true, text: "A"};
		formula1.children[0].children[0].children[1] = {isVariable: false, text: "->", children: []};
		formula1.children[0].children[0].children[1].children[0] = {isVariable: true, text: "B"};
		formula1.children[0].children[0].children[1].children[1] = {isVariable: true, text: "A"};
		
		formula1.children[0].children[1] = {isVariable: false, text: "->", children: []};
		formula1.children[0].children[1].children[0] = {isVariable: false, text: "->", children: []};
		formula1.children[0].children[1].children[1] = {isVariable: true, text: "G"};
		
		formula1.children[0].children[1].children[0].children[0] = {isVariable: false, text: "->", children: []};
		formula1.children[0].children[1].children[0].children[0].children[0] = {isVariable: false, text: "~", children: []};
		formula1.children[0].children[1].children[0].children[0].children[0].children[0] = {isVariable: true, text: "C"};
		formula1.children[0].children[1].children[0].children[0].children[1] = {isVariable: false, text: "->", children: []};
		formula1.children[0].children[1].children[0].children[0].children[1].children[0] = {isVariable: true, text: "D"};
		formula1.children[0].children[1].children[0].children[0].children[1].children[1] = {isVariable: false, text: "~", children: []};
		formula1.children[0].children[1].children[0].children[0].children[1].children[1].children[0] = {isVariable: true, text: "E"};
		
		formula1.children[0].children[1].children[0].children[1] = {isVariable: false, text: "->", children: []}; 
		formula1.children[0].children[1].children[0].children[1].children[0] = {isVariable: false, text: "->", children: []};
		formula1.children[0].children[1].children[0].children[1].children[0].children[0] = {isVariable: true, text: "C"};
		formula1.children[0].children[1].children[0].children[1].children[0].children[1] = {isVariable: false, text: "->", children: []};
		formula1.children[0].children[1].children[0].children[1].children[0].children[1].children[0] = {isVariable: true, text: "D"};
		formula1.children[0].children[1].children[0].children[1].children[0].children[1].children[1] = {isVariable: true, text: "F"};
		
		formula1.children[0].children[1].children[0].children[1].children[1] = {isVariable: false, text: "->", children: []};
		formula1.children[0].children[1].children[0].children[1].children[1].children[0] = {isVariable: false, text: "->", children: []};
		formula1.children[0].children[1].children[0].children[1].children[1].children[0].children[0] = {isVariable: true, text: "E"};
		formula1.children[0].children[1].children[0].children[1].children[1].children[0].children[1] = {isVariable: true, text: "D"};
		
		formula1.children[0].children[1].children[0].children[1].children[1].children[1] = {isVariable: false, text: "->", children: []};
		formula1.children[0].children[1].children[0].children[1].children[1].children[1].children[0] = {isVariable: true, text: "E"};
		formula1.children[0].children[1].children[0].children[1].children[1].children[1].children[1] = {isVariable: true, text: "F"};
		
		formula1.children[1] = {isVariable: false, text: "->", children: []};
		formula1.children[1].children[0] = {isVariable: true, text: "H"};
		formula1.children[1].children[1] = {isVariable: true, text: "G"};
		
		// Add axioms to the tree
		addChild("axiom", formula1, null, null);
		
		drawTree();
	}
	