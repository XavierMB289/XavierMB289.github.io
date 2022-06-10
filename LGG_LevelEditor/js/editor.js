//Game Variables
var selected, items;
var selW, selH;
var userSelect = 0, oldUS = null, userItem = null;
var level; //The new level...

function gameInit(){
	selected = getImage("img/selected_slot.png");
	items = { //dictionary containing gate data
		"names": ["andGate", "notGate", "bufferGate", "orGate", "omniGate", "battery", "button", "wire", "input", "output"],
		"andGate": [getImage("img/and_gate.png"), 2, 1], //each gate [img, # of inputs, # of outputs]
		"notGate": [getImage("img/not_gate.png"), 2, 1],
		"bufferGate": [getImage("img/buffer_gate.png"), 1, 2],
		"orGate": [getImage("img/or_gate.png"), 2, 1],
		"omniGate": [getImage("img/omni_gate.png"), 1, 1], //TODO: Fix this line after changing omnigate
		"battery": [getImage("img/battery_empty.png"), 1, 0],
		"button": [getImage("img/button_off.png"), 0, 1],
		"wire": [getImage("img/pipe.png"), 1, 1],
		"input": [getImage("img/input.png"), 0, 1],
		"output": [getImage("img/output.png"), 1, 0]
	};
	
	selected.onload = function(){ //allows for download and play on desktop
		selW = selected.width;
		selH = selected.height;
	};
	
	level = {
		"name": "Unnamed Level",
		"hints": [],
		"level": [],
		"inv": [null, null, null, null, null, null],
		"startInGrid": [false, 0, 0],
		"disabledKeys": []
	};
}
function gameUpdate(){
	
}
function slowGameUpdate(){
	
	ctx.font = "20px Caveat";
	ctx.fillStyle = "#FFFFFF";
	
	ctx.translate(50, canvasH/2-4*selW-4);
	for(var i = 0; i < level.level.length; i++){
		var item = level.level[i];
		var dirs = item[1];
		var x = item[2];
		var y = item[3];
		drawItem(level, item[0], x, y, dirs);
	}
	if(userSelect < 96){
		var x = userSelect % 12;
		var y = Math.floor(userSelect/12);
		if(userItem != null){
			ctx.drawImage(userItem[1][0], x*selW+x, y*selH+y);
		}
		ctx.drawImage(selected, x*selW+x, y*selH+y);
	}
	ctx.translate(-50, -(canvasH/2-4*selW-4));
	
	//Drawing All the different usable items in the inventory grid
	ctx.translate(canvasW-7*selW-7, canvasH/2-4*selW-4);
	for(var i = 0; i < items.names.length; i++){
		var x = i % 6;
		var y = Math.floor(i / 6);
		ctx.drawImage(items[items["names"][i]][0], x*selW+x, y*selW+y);
	}
	if(userSelect > 95){
		var x = (userSelect-96) % 6;
		var y = Math.floor((userSelect-96)/6);
		ctx.drawImage(selected, x*selW+x, y*selH+y);
	}
	ctx.translate(-(canvasW-7*selW-7), -(canvasH/2-4*selW-4));
}
function showError(message){
	var li = document.getElementById("errorCode");
	li.innerHTML = message;
	li.style.visibility = "visible";
	setTimeout(function(){
		document.getElementById("errorCode").style.visibility = "hidden";
	}, 2000);
}
document.onkeyup = function(e){
	var letter = e.key.toLowerCase();
	if(userSelect < 96){ //On game board...
		switch(letter){ //No matter what...
			case "w": //up
				userSelect -= userSelect - 12 > -1 ? 12 : 0;
				break;
			case "s":
				userSelect += userSelect + 12 < 96 ? 12 : 0;
				break;
			case "a":
				userSelect -= userSelect % 12 != 0 ? 1 : 0;
				break;
			case "d":
				userSelect += (userSelect + 1) % 12 != 0 ? 1 : 0; 
				break;
			case "enter":
				if(userItem != null){
					if(getItem(level, x, y) != null){
						removeItem(level, x, y);
					}
					var inputs = "", outputs = "";
					if(userItem[1][1] > 0){
						do{
							inputs = prompt("Input DIRS: (n,s,e,w)\nTHE LAST LETTER IS THE OUTPUT\nExample:w,e");
						}while(inputs.split(",").length != userItem[1][1]);
					}
					inputs = inputs == "" ? null : inputs;
					if(userItem[1][2] > 0){
						do{
							outputs = prompt("Output DIRS: (n,s,e,w)\nTHE LAST LETTER IS THE OUTPUT\nExample:w,e");
						}while(outputs.split(",").length != userItem[1][2]);
					}
					outputs = outputs == "" ? null : outputs;
					var x = userSelect % 12;
					var y = Math.floor(userSelect/12);
					if(getItem(level, x, y) != null){
						var affirm = prompt("Are you sure? (type: \"yes\" for YES)");
						if(affirm.toLowerCase() != "yes"){
							return;
						}else{
							removeItem(level, x, y);
						}
					}
					var tempArray = [userItem[0], [inputs,outputs], x, y, false];
					if(userItem[0]!="wire"){ //If not wire, add image
						tempArray.push(userItem[1][0]);
					}
					level.level.push(tempArray);
				}
				break;
			case "backspace":
				if(oldUS != null){
					var tempUS = userSelect;
					userSelect = oldUS;
					oldUS = tempUS;
				}else{
					oldUS = userSelect;
					userSelect = 96;
				}
				break;
		}
	}else{ //In "inventory"
		var tempPos = userSelect - 96;
		switch(letter){ //No matter what...
			case "w": //up
				userSelect -= tempPos - 6 > -1 ? 6 : 0;
				break;
			case "s":
				userSelect += tempPos + 6 < 48 ? 6 : 0;
				break;
			case "a":
				userSelect -= tempPos % 6 != 0 ? 1 : 0;
				break;
			case "d":
				userSelect += (tempPos + 1) % 6 != 0 ? 1 : 0; 
				break;
			case "enter":
				if(tempPos < items.names.length){
					userItem = [items.names[tempPos], items[items.names[tempPos]]];
				}
				//NO BREAK!!
			case "backspace":
				if(oldUS != null){
					var tempUS = userSelect;
					userSelect = oldUS;
					oldUS = tempUS;
				}
				break;
		}
	}
};
document.getElementById("hasInv").onclick = function(){ //Adding the inventory to the level
	var li = this.parentElement.parentElement; //gets the li surrounding it... badly.
	if(this.checked){
		var vals = ["NOTHING HERE", "wire", "andGate", "orGate", "battery", "bufferGate", "notGate"];
		var check = document.createElement("select");
		for(var i = 0; i < vals.length; i++){
			var opt = document.createElement("option");
			opt.setAttribute("value", vals[i]);
			opt.innerHTML = vals[i];
			check.appendChild(opt);
		}
		for(var i = 0; i < 6; i++){
			var checkClone = check.cloneNode(true);
			checkClone.setAttribute("name", i);
			li.appendChild(checkClone);
		}
	}else{
		for(var i = 0; i < 6; i++){
			li.removeChild(li.children[1]);
		}
	}
}
document.getElementById("gridStart").onclick = function(){
	var li = this.parentElement.parentElement; //gets the li surrounding it... badly.
	if(this.checked){
		var input = document.createElement("input");
		input.setAttribute("type", "text");
		input.setAttribute("name", "startCoords");
		input.setAttribute("placeholder", "Grid Start Coords...");
		input.setAttribute("style", "display:block;margin-top:10px;");
		li.appendChild(input);
	}else{
		li.removeChild(li.children[1]);
	}
}
document.getElementById("saveButton").onclick = saveButtonPressed;
function saveButtonPressed(){ //SAVE
	var elm = document.getElementsByName("title")[0];
	if(elm.value == "") return;
	level.name = elm.value;
	elm = document.getElementsByName("hints")[0];
	if(elm.value == "") return;
	level.hints = elm.value.split(", ");
	elm = document.getElementsByName("keys")[0];
	if(elm.value == ""){
		level.disabledKeys = elm.value.contains(", ") ? elm.value.split(", ") : elm.value;
	}
	elm = document.getElementsByName("hasInv")[0];
	if(elm.checked){
		var children = elm.parentElement.parentElement.children;
		for(var i = 0; i < children.length; i++){
			if(children[i].value != "NOTHING HERE"){
				var count = prompt("How many "+children[i].value+" would you like in slot "+i+"?");
				var input = prompt("Input Direction(s)\nPlease be nice... I didn't want to code a check for this...");
				var output = prompt("Output Direction(s)....\nYeah... No check for this either...");
				var item = [children[i].value.toLowerCase(), [input, output], "inv", count];
				level.inv[i] = item;
			}
		}
	}
	elm = document.getElementsByName("gridStart")[0];
	if(elm.checked){
		var child = elm.parentElement.parentElement.children[1].split(", ");
		level.startInGrid = [true, child[0], child[1]];
	}
	
	setCookie("customLevel", level, 2);
};
document.getElementById("playButton").onclick = function(){ //PLAY
	saveButtonPressed();
	setCookie("uploadable", true, 2);
	window.location = "../logicGateGame/custom.html";
}