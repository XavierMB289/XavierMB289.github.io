//Game Variables
var unselected, selected, gatePipe, pipe, buttonSwitch, battery;
var selW, selH;
var userSelect = 0, oldUS, userItem = null; //The keypress is handled based on what this is... userItem = [name, direction, oldCoords]
var level, currentLevel = 1;
var startBattery = false, batteryTimer = 15;

function gameInit(){
	unselected = getImage("img/unselected_slot.png");
	selected = getImage("img/selected_slot.png");
	gatePipe = getImage("img/gate_pipe.png");
	pipe = getImage("img/pipe.png");
	buttonSwitch = [getImage("img/button_off.png"), getImage("img/button_on.png")];
	battery = [getImage("img/battery_empty.png"), getImage("img/battery_close.png"), getImage("img/battery_half.png"), getImage("img/battery_full.png")];
	
	selected.onload = function(){ //allows for download and play on desktop
		selW = selected.width;
		selH = selected.height;
		//addNode(3.5, 2.5, selW, 3, getImage("img/power.png"), [[8.5, 2.5]]); //commented out until needed...
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
}
function gameUpdate(){
	
}
function slowGameUpdate(){
	
	if(level == null){
		return;
	}
	
	ctx.fillText(level.name, 20, 10);
	ctx.translate(canvasW/2-3*selW-3,canvasH-selH-10);
	for(let x = 0; x < 6; x++){
		var item = level.inv[x];
		if(item!=null){
			drawItem(item[0], x*selW+x, item[3], item[1], true);
		}
		if(x == userSelect){
			ctx.drawImage(selected, x*selW+x, 0);
		}else{
			ctx.drawImage(unselected, x*selW+x, 0);
		}
	}
	ctx.translate(-(canvasW/2-3*selW-3),-(canvasH-selH-10));
	
	ctx.translate(canvasW/2-6*selW-6,10);
	nodeCycle();
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
	
	ctx.translate(-(canvasW/2-6*selW-6),-10);
	
	if(startBattery != false){
		batteryTimer--;
		if(batteryTimer <= 0){
			batteryTimer = 15;
			var item = getItemByName(level, "battery");
			level = alterItem(level, [item[0], item[1], item[2]+","+item[3]], battery);
			if(item[4] == battery[3]){
				startBattery = false;
				currentLevel++;
				getLevel("level/"+currentLevel+".json", loadGameLevel);
			}
		}
	}
}
document.onkeyup = function(e){
	var letter = e.key.toLowerCase();
	if(userSelect < 6){ //if in the inventory
		switch(letter){
			case "a": //left
				userSelect -= userSelect - 1 > -1 ? 1 : 0;
				break;
			case "d": //right
				userSelect += userSelect + 1 < 6 ? 1 : 0;
				break;
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
						addNode(x+.5, y+.5, selW, 5, getImage("img/power.png"), [[next[2]+.5, next[3]+.5]], function(){ if(next[0]=="battery"){startBattery = true;} });
					}
				}else if(temp == null){
					temp = userSelect - 6;
					var x = temp % 12;
					var y = Math.floor(temp/12);
					level = addItem(level, userItem, x, y);
					userItem = null;
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
}
function drawItem(name, x, y, dirs, inventory = false){
	if(inventory != true){ //if item is on field
		switch(name){ //Item name
			case "button":
				ctx.drawImage(getItemImage(level, x, y), x*selW+x, y*selH+y);
				drawPipes(x, y, dirs);
				break;
			case "battery":
				ctx.drawImage(getItemImage(level, x, y), x*selW+x, y*selH+y);
				drawPipes(x, y, dirs);
				break;
		}
	}else{ //If the image is in inventory
		switch(name){ //Item name
			case "button":
				ctx.drawImage(buttonSwitch[0], x*selW+x, y*selH+y);
				drawPipes(x, y, dirs);
				break;
			case "battery":
				ctx.drawImage(battery[0], x*selW+x, y*selH+y);
				drawPipes(x, y, dirs);
				break;
		}
	}//BOTH
	switch(name){
		case "wire":
			drawPipes(x, y, dirs, false);
			break;
	}
}
function drawPipes(x, y, dirs, gate = true){
	dirs = dirs.includes(",") ? dirs.split(",") : [dirs];
	for(var j = 0; j < dirs.length; j++){
		ctx.save();
		ctx.translate(x*selW+x+(selW/2), y*selH+y+(selH/2));
		switch(dirs[j]){
			case "s":
				ctx.rotate(Math.PI);
				break;
			case "e":
				ctx.rotate(0.5*Math.PI);
				break;
			case "w":
				ctx.rotate(1.5*Math.PI);
				break;
		}
		if(gate != false){
			ctx.drawImage(gatePipe, -selW/2, -selH/2);
		}else{
			ctx.drawImage(pipe, -selW/2, -selH/2);
		}
		ctx.restore();
	}
}