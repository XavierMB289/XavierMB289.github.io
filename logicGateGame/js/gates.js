var buttonSwitch, battery;
var startBattery = false, batteryTimer = 10;

function gateInit(){
	buttonSwitch = [getImage("img/button_off.png"), getImage("img/button_on.png")];
	battery = [getImage("img/battery_empty.png"), getImage("img/battery_close.png"), getImage("img/battery_half.png"), getImage("img/battery_full.png")];
}

function batteryUpdate(level, currentLevel){
	if(startBattery != false){
		batteryTimer--;
		if(batteryTimer <= 0){
			batteryTimer = 10;
			var item = getItemByName(level, "battery");
			level = alterItem(level, [item[0], item[1], item[2]+","+item[3]], battery);
			if(item[4] == battery[3]){
				startBattery = false;
				currentLevel++;
				getLevel("level/"+currentLevel+".json", loadGameLevel);
				setCookie("currentLevel", currentLevel, 7);
			}
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