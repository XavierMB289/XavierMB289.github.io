//Game Variables
var selected, items;
var selW, selH;
var userSelect = 0, oldUS = null, userItem = null, hoveredItem = null;
var level; //The new level...

function gameInit(){
	selected = getImage("img/selected_slot.png");
	items = {
		"names": ["andGate", "battery", "button", "wire"],
		"andGate": getImage("img/and_gate.png"),
		"battery": getImage("img/battery_empty.png"),
		"button": getImage("img/button_off.png"),
		"wire": getImage("img/pipe.png")
	};
	
	selected.onload = function(){ //allows for download and play on desktop
		selW = selected.width;
		selH = selected.height;
	};
	
	level = {
		"name": "Unnamed Level",
		"hints": [],
		"level": [],
		"inv": [],
		"startInGrid": [],
		"disabledKeys": []
	};
}
function gameUpdate(){
	
}
function slowGameUpdate(){
	
	ctx.font = "20px Caveat";
	ctx.fillStyle = "#FFFFFF";
	
	ctx.translate(10, canvasH/2-4*selW-4);
	for(var i = 0; i < level.level.length; i++){
		var item = level.level[i];
		var dirs = item[1];
		var x = item[2];
		var y = item[3];
		drawItem(level, level.level[i][0], x, y, dirs);
	}
	if(userSelect < 96){
		var x = userSelect % 12;
		var y = Math.floor(userSelect/12);
		if(userItem != null){
			ctx.drawImage(userItem[1], x*selW+x, y*selH+y);
		}
		ctx.drawImage(selected, x*selW+x, y*selH+y);
	}
	ctx.translate(-10, -(canvasH/2-4*selW-4));
	
	//Drawing All the different usable items in the inventory grid
	ctx.translate(canvasW-7*selW-7, canvasH/2-4*selW-4);
	for(var i = 0; i < items.names.length; i++){
		var x = i % 6;
		var y = Math.floor(i / 6);
		ctx.drawImage(items[items["names"][i]], x*selW+x, y*selW+y);
	}
	if(userSelect > 95){
		var x = (userSelect-96) % 6;
		var y = Math.floor((userSelect-96)/6);
		ctx.drawImage(selected, x*selW+x, y*selH+y);
	}
	ctx.translate(-(canvasW-7*selW-7), -(canvasH/2-4*selW-4));
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
					var inputs = prompt("Input DIRS: (n,s,e,w)\nTHE LAST LETTER IS THE OUTPUT\nExample:w,e");
					inputs = inputs == "" ? null : inputs;
					var outputs = prompt("Output DIRS: (n,s,e,w)\nTHE LAST LETTER IS THE OUTPUT\nExample:w,e");
					outputs = outputs == "" ? null : outputs;
					var x = userSelect % 12;
					var y = Math.floor(userSelect/12);
					var tempArray = [userItem[0], [inputs,outputs], x, y, false];
					if(userItem[0]!="wire"){
						tempArray.push(userItem[1]);
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
		if(letter == "w" || letter == "a" || letter == "s" || letter == "d"){
			if(userSelect > 95){
				var x = (userSelect-96) % 6;
				var y = Math.floor((userSelect-96)/6);
				var tempItem = getItem(level, x, y);
				if(tempItem != null){
					hoveredItem = tempItem;
				}
			}
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