//Game Variables
var unselected, selected, audioImg, inputImg, outputImg;
var selW, selH;
var userSelect = 0, oldUS = 0, userItem = null; //The keypress is handled based on what this is... userItem = [name, direction, oldCoords]
var level, currentLevel, currentHint;

window.onbeforeunload = function(){
	if(currentLevel > getCookie("currentLevel")){
		setCookie("currentLevel", currentLevel, 7);
	}
};

function gameInit(){
	unselected = getImage("img/unselected_slot.png");
	selected = getImage("img/selected_slot.png");
	audioImg = [getImage("img/audio_on.png"), getImage("img/audio_off.png")];
	inputImg = getImage("img/input.png");
	outputImg = getImage("img/output.png");
	
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
	
	if(!isCustomGame){
		getLevel("level/"+currentLevel+".json", loadGameLevel);
	}else{
		customGameInit();
	}
}
function loadGameLevel(obj, firstTime=true){
	//getting the level obj from ajax workaround
	var tempLevel = obj;
	//setting up the images for the level... ALSO SETTING UP THE GATES!!!
	for(var i = 0; i < tempLevel.level.length; i++){
		var item = tempLevel.level[i];
		if(item[0].includes("Gate")){
			var gate = item[0].split("Gate")[0];
			if(gate != "omni"){
				tempLevel.level[i][5] = new Gate(item[1], [item[2], item[3]], gate);
			}else{
				tempLevel.level[i][5] = new Omnigate(item[1], [item[2], item[3]], gate, item[6]);
			}
			continue;
		}
		switch(item[0]){ //Item name
			case "button":
				tempLevel.level[i][5] = buttonSwitch[0];
				break;
			case "battery":
				tempLevel.level[i][5] = battery[0];
				break;
			case "input":
				tempLevel.level[i][5] = inputImg;
				break;
			case "output":
				tempLevel.level[i][5] = outputImg;
				break;
		}
	}
	if(firstTime != false){
		//Trying to fix this problem with battery
		var temp = batteryUpdate(tempLevel, currentLevel);
		tempLevel = temp[0];
		currentLevel = temp[1];
		if(tempLevel.startInGrid[0]){
			userSelect = tempLevel.startInGrid[2] * 12 + tempLevel.startInGrid[1] + 6;
		}
		currentHint = 0;
		level = tempLevel;
	}else{
		return tempLevel;
	}
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
			drawItem(level, item[0], x, 0, item[1], true);
			ctx.fillText(""+item[3], x*selW+x+10, selW*0.8);
		}
		if(x == userSelect){
			ctx.drawImage(selected, x*selW+x, 0);
		}else{
			ctx.drawImage(unselected, x*selW+x, 0);
		}
	}
	ctx.translate(-(canvasW/2-3*selW-3),-(canvasH-selH-10));
	
	ctx.translate(canvasW/2-6*selW-6,20);
	for(var i = 0; i < level.level.length; i++){
		var item = level.level[i];
		var dirs = item[1];
		var x = item[2];
		var y = item[3];
		drawItem(level, level.level[i][0], x, y, dirs);
		//ctx.fillText(level.level[i][4], x*selW+x, y*selW+y);
	}
	if(userSelect >= 6){
		var temp = userSelect - 6;
		var x = temp % 12;
		var y = Math.floor(temp/12);
		ctx.drawImage(selected, x*selW+x, y*selH+y);
		if(userItem != null){
			drawItem(level, userItem[0], x, y, userItem[1]);
		}
	}
	
	level = nodeCycle(level); //for particles
	
	ctx.drawImage(left, -selW*2, selW*3.5);
	ctx.drawImage(right, selW*13, selW*3.5);
	
	ctx.fillText(currentLevel+": "+level.name, 10, 0);
	ctx.fillText(level.hints[currentHint], 10, selW*8.4);
	
	ctx.translate(-(canvasW/2-6*selW-6),-20);
	
	ctx.drawImage(audioImg[muted?1:0], canvasW-audioImg[0].width-10, canvasH-audioImg[0].height-10);
	
	var temp = batteryUpdate(level, currentLevel);
	level = temp[0];
	currentLevel = temp[1];
}

function gameKeyUp(e){
	var letter = e.key.toLowerCase();
	var x = (userSelect-6) % 12;
	var y = Math.floor((userSelect-6)/12);
	if(level.disabledKeys.includes(letter)){
		return;
	}
	
	if("wasd".split("").includes(letter)){
		createPlayer("effects/move.wav", 0.5);
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
				var temp = getItemIndex(level, userSelect, 0, true);
				if(temp != null && parseInt(level.inv[temp][3]) > 0){
					userItem = level.inv[temp];
					level.inv[temp][3] -= 1; //Just to make sure it runs right
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
	}else if(nodes.length <= 0){ //if on the board...
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
				var temp = getItem(level, x, y);
				if(temp != null && (temp[2] == "inv" || temp[0] == "wire")){ //if you're on an item, go ahead and remove it
					if(userItem != null){
						level = returnItem(level, userItem);
						userItem = null;
					}
					userItem = temp;
					level = removeItem(level, x, y);
				}else if(temp != null){
					if(temp[0] == "button"){
						if(temp[5] == buttonSwitch[0]){
							level.level[getItemIndex(level, temp[2], temp[3])][4] = true;
							var next = getNextGate(level, userSelect);
							addNode(x+.5, y+.5, selW, getImage("img/power.png"), getPathToNext(level, userSelect), 1, function(){
								if(next != null){
									if(next[0].toLowerCase().includes("gate")){
										return next[5].solveGate(level, selW);
									}else if(next[0].toLowerCase().includes("output")){
										return omnigates[omnigates.length-1].onReturn(level, true);
									}
								}
							});
						}else{
							level.level[getItemIndex(level, temp[2], temp[3])][4] = false;
							var next = getNextGate(level, userSelect);
							addNode(x+.5, y+.5, selW, getImage("img/powerless.png"), getPathToNext(level, userSelect), -1, function(){
								if(next != null){
									if(next[0].toLowerCase().includes("gate")){
										return next[5].solveGate(level, selW);
									}else if(next[0].toLowerCase().includes("output")){
										return omnigates[omnigates.length-1].onReturn(level, true);
									}
								}
							});
						}
						level = alterItem(level, temp, buttonSwitch);
					}else if(temp[0] == "omniGate"){ //Here is the code that checks for omnigates
						level = temp[5].onUserSelect(level);
					}
				}else if(temp == null){
					if(userItem != null){
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
			case "6":
				if(inOmnigate != false){
					level = omnigates[omnigates.length-1].onReturn(level);
				}
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
		case "r":
			getLevel("level/"+currentLevel+".json", loadGameLevel);
			break;
		case "m":
			muted = !muted;
			break;
	}
}
