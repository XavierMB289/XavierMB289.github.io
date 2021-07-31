var buttonSwitch, battery, andGate;
var startBattery = false, batteryTimer = 7;

function gateInit(){
	buttonSwitch = [getImage("img/button_off.png"), getImage("img/button_on.png")];
	battery = [getImage("img/battery_empty.png"), getImage("img/battery_close.png"), getImage("img/battery_half.png"), getImage("img/battery_full.png")];
	andGate = getImage("img/and_gate.png");
}

function batteryUpdate(level, currentLevel){
	batteryTimer--;
	if(batteryTimer <= 0){
		batteryTimer = 7;
		var item = getItemByName(level, "battery");
		level = alterItem(level, [item[0], item[1], item[2]+","+item[3]], battery);
		if(item[4] == battery[3]){
			startBattery = false;
			currentLevel++;
			getLevel("level/"+currentLevel+".json", loadGameLevel);
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
	
	constructor(selW, dirs, coords, gateType){
		this.selW = selW;
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
	#genOutput(level){
		var userSelect = this.coords[0]+(this.coords[1]*12)+6;
		var next = getNextItem(level, userSelect);
		addNode(this.coords[0]+.5, this.coords[1]+.5, this.selW, getImage("img/power.png"), getPathToNext(level, userSelect), function(){
			if(next != null){
				if(next[0]=="battery"){
					startBattery = true;
				}
				if(next[0].toLowerCase().includes("gate")){
					return next[5].solveGate(level);
				}
			} 
		});
		if(next[0].toLowerCase().includes("gate") != true){
			return energize(level, getItem(level, userSelect));
		}
	}
	solveGate(level){
		this.#getInputs(level);
		switch(this.gateType){
			case "and":
				if(this.inputs[0] * this.inputs[1] == 1){
					return this.#genOutput(level);
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