var buttonSwitch, battery, andGate;
var batteryTimer = 7;
var batteryItem = null, prevItemIndex = null;

function gateInit(){
	buttonSwitch = [getImage("img/button_off.png"), getImage("img/button_on.png")];
	battery = [getImage("img/battery_empty.png"), getImage("img/battery_close.png"), getImage("img/battery_half.png"), getImage("img/battery_full.png")];
	andGate = getImage("img/and_gate.png");
}

function batteryUpdate(level, currentLevel){
	if(batteryItem == null){
		batteryItem = getItemByName(level, "battery");
		prevItemIndex = getPrevItemIndex(level, batteryItem);
	}
	if(level.level[prevItemIndex][4]){
		batteryTimer--;
		if(batteryTimer <= 0){
			if(batteryItem[5] != battery[3]){
				level = alterItem(level, batteryItem, battery);
				batteryItem = getItemByName(level, "battery");
				batteryTimer = 7;
			}else if(batteryTimer <= -7){
				batteryTimer = 7;
				currentLevel++;
				getLevel("level/"+currentLevel+".json", loadGameLevel);
			}
		}
		
	}
	return [level, currentLevel];
}
class Gate{
	selW = null;
	dirs = null;
	coords = null;
	inputs = null; //Binary Algebra
	inputCoords = null; //Where to look for the Energized tag
	gateType = null;
	
	constructor(dirs, coords, gateType){
		this.dirs = dirs.length > 1 ? dirs.split(",") : [dirs];
		this.coords = coords;
		this.inputs = [0, 0];
		this.inputCoords = [[0,0], [0,0]];
		this.gateType = gateType;
		for(let i = 0; i < this.dirs.length; i++){
			switch(this.dirs[i]){
				case "n":
					this.inputCoords[i] = [coords[0], coords[1]-1];
					break;
				case "s":
					this.inputCoords[i] = [coords[0], coords[1]+1];
					break;
				case "e":
					this.inputCoords[i] = [coords[0]+1, coords[1]];
					break;
				case "w":
					this.inputCoords[i] = [coords[0]-1, coords[1]];
					break;
			}
		}
	}
	#getInputs(level){
		var list = level.level;
		this.inputs[0] = (list.filter(x => { return x[2]==this.inputCoords[0][0]&&x[3]==this.inputCoords[0][1] })[0])[4];
		this.inputs[1] = (list.filter(x => { return x[2]==this.inputCoords[1][0]&&x[3]==this.inputCoords[1][1] })[0])[4];
	}
	#genOutput(level, selW){
		var userSelect = this.coords[0]+(this.coords[1]*12)+6;
		var next = getNextItem(level, userSelect);
		addNode(this.coords[0]+.5, this.coords[1]+.5, selW, getImage("img/power.png"), getPathToNext(level, userSelect), function(){
			if(next != null){
				if(next[0].toLowerCase().includes("gate")){
					return next[5].solveGate(level, selW);
				}
			} 
		});
	}
	solveGate(level, selW){
		this.#getInputs(level);
		if(nodes.length > 1){ //Make sure there is only 1?
			return level;
		}
		switch(this.gateType){
			case "and":
				if(this.inputs[0] * this.inputs[1] == 1){
					return this.#genOutput(level, selW);
				}
				break;
		}
		return level;
	}
}
function drawItem(name, x, y, dirs, inventory = false){
	if(inventory != true){ //if item is on field
		switch(name){ //Item name
			case "button":
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
		case "andGate":
			ctx.drawImage(andGate, x*selW+x, y*selH+y);
			drawPipes(x, y, dirs);
			break;
	}
}