//Game Variables
var selected, items;
var selW, selH;
var userSelect = 0, oldUS, userItem = null; //The keypress is handled based on what this is... userItem = [name, direction, oldCoords]
var level; //The new level...

function gameInit(){
	selected = getImage("img/selected_slot.png");
	items = {
		"names": ["andGate", "battery", "buttonSwitch", "pipe"],
		"andGate": getImage("img/and_gate.png"),
		"battery": getImage("img/battery_empty.png"),
		"buttonSwitch": getImage("img/button_off.png"),
		"pipe": getImage("img/pipe.png")
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
	if(userSelect < 96){
		var x = userSelect % 12;
		var y = Math.floor(userSelect/12);
		ctx.drawImage(selected, x*selW+x, y*selH+y);
		if(userItem != null){
			drawItem(userItem[0], x, y, userItem[1]);
		}
	}
	ctx.translate(-10, -(canvasH/2-4*selW-4));
	
	//Drawing All the different usable items in the inventory grid
	ctx.translate(canvasW-7*selW-7, canvasH/2-4*selW-4);
	for(var i = 1; i < items.length; i++){
		var x = i % 6;
		var y = Math.floor(i / 6);
		ctx.drawImage(items[items["names"][i]], x*selW-x, y*selW-y);
	}
	ctx.translate(-(canvasW-7*selW-7), -(canvasH/2-4*selW-4));
}
document.onkeyup = function(e){
	var letter = e.key.toLowerCase();
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
	}
};