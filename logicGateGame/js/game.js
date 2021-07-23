//Game Variables
var unselected, selected, left, right;
var selW, selH;
var userSelect = 0, oldUS, userItem = null; //The keypress is handled based on what this is... userItem = [name, direction, oldCoords]
var level, currentLevel, currentHint;

window.onbeforeunload = function(){
	setCookie("currentLevel", currentLevel, 7);
};

function gameInit(){
	unselected = getImage("img/unselected_slot.png");
	selected = getImage("img/selected_slot.png");
	left = getImage("img/left_comma.png");
	right = getImage("img/right_period.png");
	
	selected.onload = function(){ //allows for download and play on desktop
		selW = selected.width;
		selH = selected.height;
	}
	
	currentLevel = getCookie("currentLevel");
	if(currentLevel == ""){
		currentLevel = 1;
	}else{
		currentLevel = parseInt(currentLevel);
	}
	
	getLevel("level/"+currentLevel+".json", loadGameLevel);
}
function loadGameLevel(obj){
	//getting the level obj from ajax workaround
	level = obj;
	//setting up the images for the level...
	for(var i = 0; i < level.level.length; i++){
		var name = level.level[i][0];
		switch(name){ //Item name
			case "button":
				level.level[i][4] = buttonSwitch[0];
				break;
			case "battery":
				level.level[i][4] = battery[0];
				break;
		}
	}
	if(level.startInGrid[0]){
		userSelect = level.startInGrid[2] * 12 + level.startInGrid[1] + 6;
	}
	currentHint = 0;
}
function gameUpdate(){
	
}
function slowGameUpdate(){
	
	ctx.font = "20px Caveat";
	ctx.fillStyle = "#FFFFFF";
	
	if(level == null){
		return;
	}
	
	ctx.translate(canvasW/2-3*selW-3,canvasH-selH-10);
	for(let x = 0; x < 6; x++){
		var item = level.inv[x];
		if(item!=null && item[3] > 0){
			drawItem(item[0], x, 0, item[1], true);
			ctx.fillText(""+item[3], x*selW+x+10, selW*0.8);
		}
		if(x == userSelect){
			ctx.drawImage(selected, x*selW+x, 0);
		}else{
			ctx.drawImage(unselected, x*selW+x, 0);
		}
	}
	ctx.translate(-(canvasW/2-3*selW-3),-(canvasH-selH-10));
	
	ctx.translate(canvasW/2-6*selW-6,10);
	nodeCycle(); //for particles
	for(var i = 0; i < level.level.length; i++){
		var x = level.level[i][2];
		var y = level.level[i][3];
		var dirs = level.level[i][1];
		
		drawItem(level.level[i][0], x, y, dirs);
	}
	if(userSelect >= 6){
		var temp = userSelect - 6;
		var x = temp % 12;
		var y = Math.floor(temp/12);
		ctx.drawImage(selected, x*selW+x, y*selH+y);
		if(userItem != null){
			drawItem(userItem[0], x, y, userItem[1]);
		}
	}
	
	ctx.drawImage(left, -selW*2, selW*3.5);
	ctx.drawImage(right, selW*13, selW*3.5);
	
	ctx.fillText(level.name, 20, 10);
	ctx.fillText(level.hints[currentHint], 10, selW*8);
	
	ctx.translate(-(canvasW/2-6*selW-6),-10);
	
	batteryUpdate(level, currentLevel);
}
document.onkeyup = function(e){
	var letter = e.key.toLowerCase();
	if(level.disabledKeys.includes(letter)){
		return;
	}
	if(userSelect < 6){ //if in the inventory
		switch(letter){
			case "a": //left
				userSelect -= userSelect - 1 > -1 ? 1 : 0;
				break;
			case "d": //right
				userSelect += userSelect + 1 < 6 ? 1 : 0;
				break;
			case "enter":
				var temp = getItem(level, userSelect, true);
				if(temp != null){
					userItem = temp;
				}//NO BREAK! WE WANT THE BACKSPACE CODE TO RUN!
			case "backspace": //change selection
				var temp = userSelect;
				userSelect = oldUS > 5 ? oldUS : 6;
				oldUS = temp;
				break;
			default:
				console.log(letter);
				break;
		}
	}else{ //if on the board...
		var temp = userSelect - 6;
		switch(letter){
			case "w": //up
				userSelect -= temp - 12 > -1 ? 12 : 0;
				break;
			case "s":
				userSelect += temp + 12 < 96 ? 12 : 0;
				break;
			case "a":
				userSelect -= temp % 12 != 0 ? 1 : 0;
				break;
			case "d":
				userSelect += (temp + 1) % 12 != 0 ? 1 : 0; 
				break;
			case "enter":
				var temp = getItem(level, userSelect);
				if(temp != null && (temp[2] == "inv" || temp[0] == "wire")){ //if you're on an item, go ahead and remove it
					if(userItem != null){
						level = returnItem(level, userItem);
						userItem = null;
					}
					userItem = temp;
					temp = userSelect - 6;
					var x = temp % 12;
					var y = Math.floor(temp/12);
					level = removeItem(level, x, y);
				}else if(temp != null){
					if(temp[0] == "button"){
						level = alterItem(level, temp, buttonSwitch);
						var next = getNextItem(level, userSelect);
						temp = userSelect - 6;
						var x = temp % 12;
						var y = Math.floor(temp/12);
						addNode(x+.5, y+.5, selW, 5, getImage("img/power.png"), getPathToNext(level, userSelect), function(){ if(next[0]=="battery"){startBattery = true;} });
					}
				}else if(temp == null){
					if(userItem != null){
						temp = userSelect - 6;
						var x = temp % 12;
						var y = Math.floor(temp/12);
						level = addItem(level, userItem, x, y);
						userItem = null;
					}
				}
				break;
			case "backspace":
				if(userItem != null){
					level = returnItem(level, userItem);
					userItem = null;
				}
				temp = userSelect;
				userSelect = oldUS;
				oldUS = temp;
				break;
			default:
				console.log(letter);
				break;
		}
	}
	//No matter the "state" check for these to change level
	switch(letter){
		case "<":
		case ",":
			if(currentLevel - 1 > 0){
				currentLevel--;
				getLevel("level/"+currentLevel+".json", loadGameLevel);
			}
			break;
		case ">":
		case ".":
			if(currentLevel + 1 <= parseInt(getCookie("currentLevel"))){
				currentLevel++;
				getLevel("level/"+currentLevel+".json", loadGameLevel);
			}
			break;
		case "e":
			currentHint += currentHint + 1 < level.hints.length ? 1 : 0;
			break;
	}
}