var buttonSwitch, battery, andGate, notGate, bufferGate, orGate, omniImg;
var batteryTimer = 7;
var batteryItem = null, prevItemIndex = null;

winFunction = function(level, currentLevel){
	batteryTimer = 7;
	prevItemIndex = null;
	currentLevel++;
	getLevel("level/"+currentLevel+".json", loadGameLevel);
	batteryItem = getItemByName(level, "battery");
};

function gateInit(){
	buttonSwitch = [getImage("img/button_off.png"), getImage("img/button_on.png")];
	battery = [getImage("img/battery_empty.png"), getImage("img/battery_half.png"), getImage("img/battery_full.png")];
	andGate = getImage("img/and_gate.png");
	notGate = getImage("img/not_gate.png");
	bufferGate = getImage("img/buffer_gate.png");
	orGate = getImage("img/or_gate.png");
	omniImg = getImage("img/omni_gate.png");
}

function batteryUpdate(level, currentLevel){
	batteryItem = getItemByName(level, "battery");
	if(prevItemIndex == null){
		prevItemIndex = getPrevItemIndex(level, batteryItem);
	}
	if(batteryItem != null){
		if(batteryItem[4] != false){
			if(--batteryTimer <= 0 && nodes.length < 1){
				winFunction(level, currentLevel);
			}else{
				level = alterItem(level, batteryItem, [battery[2]]);
			}
		}else if(prevItemIndex != null && level.level[prevItemIndex][4]){
			level = alterItem(level, batteryItem, [battery[1]]);	
		}else{
			batteryTimer = 7;
			level = alterItem(level, batteryItem, [battery[0]]);
		}
	}
	return [level, currentLevel];
}
class Gate{
	selW = null;
	dirs = null;
	inputDir = null;
	outputDir = null;
	coords = null;
	inputs = null; //Binary Algebra
	inputCoords = null; //Where to look for the Energized tag
	gateType = null;
	
	constructor(dirs, coords, gateType){
		this.dirs = dirs;
		this.inputDir = dirs[0].length > 1 ? dirs[0].split(",") : [dirs[0]];
		this.outputDir = dirs[1].length > 1 ? dirs[1].split(",") : [dirs[1]];
		this.coords = coords;
		this.inputs = [0, 0];
		this.inputCoords = new Array(this.inputDir.length);
		this.gateType = gateType;
		for(let i = 0; i < this.inputDir.length; i++){
			switch(this.inputDir[i]){
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
	getInputs(level){
		var list = level.level;
		if(this.inputCoords.length > 0){ this.inputs[0] = (list.filter(x => { return x[2]==this.inputCoords[0][0]&&x[3]==this.inputCoords[0][1] })[0])[4];}
		if(this.inputCoords.length > 1){ this.inputs[1] = (list.filter(x => { return x[2]==this.inputCoords[1][0]&&x[3]==this.inputCoords[1][1] })[0])[4];}
	}
	genOutput(level, selW, energize, getPath=""){
		var userSelect = this.coords[0]+(this.coords[1]*12)+6;
		var next = getNextGate(level, userSelect, getPath);
		addNode(this.coords[0]+.5, this.coords[1]+.5, selW, getImage(energize == 1 ? "img/power.png": "img/powerless.png"), getPathToNext(level, userSelect, getPath), energize, function(){
			if(next != null){
				if(next[0].toLowerCase().includes("gate")){
					return next[5].solveGate(level, selW);
				}else if(next[0].toLowerCase().includes("output")){
					return omnigates[omnigates.length-1].onReturn(level, true);
				}
			}
		});
	}
	solveGate(level, selW){
		this.getInputs(level);
		if(nodes.length > 1){ //Make sure there is only 1?
			return level;
		}
		switch(this.gateType){
			case "and":
				if(this.inputs[0] * this.inputs[1] == 1){
					return this.genOutput(level, selW, 1);
				}
				break;
			case "not":
				var item = getItem(level, this.coords[0], this.coords[1]);
				if(this.inputs[0] != 1 && item[4] != true){
					return this.genOutput(level, selW, 1);
				}else if(this.inputs[0] != 0 && item[4] != false){
					return this.genOutput(level, selW, -1);
				}
				break;
			case "buffer":
				if(this.inputs[0] == 1){
					var tempLevel = level;
					for(var i = 0; i < this.outputDir.length; i++){
						level = this.genOutput(tempLevel, selW, 1, this.outputDir[i]);
					}
				}
				break;
			case "or":
				if(this.inputs[0] == 1 || this.input[1] == 1){
					return this.genOutput(level, selW, 1);
				}
				break;
		}
		return level;
	}
}
function drawItem(level, name, x, y, dirs, inventory = false){
	if(inventory != true){ //if item is on field
		switch(name){ //Item name
			case "button":
			case "battery":
			case "input":
			case "output":
				ctx.drawImage(getItemImage(level, x, y), x*selW+x, y*selH+y);
				drawPipes(level, x, y, dirs);
				break;
		}
	}else{ //If the image is in inventory
		switch(name){ //Item name
			case "button":
				ctx.drawImage(buttonSwitch[0], x*selW+x, y*selH+y);
				drawPipes(level, x, y, dirs);
				break;
			case "battery":
				ctx.drawImage(battery[0], x*selW+x, y*selH+y);
				drawPipes(level, x, y, dirs);
				break;
		}
	}//BOTH
	switch(name){
		case "wire":
			drawPipes(level, x, y, dirs, false);
			break;
		case "andGate":
			ctx.drawImage(andGate, x*selW+x, y*selH+y);
			drawPipes(level, x, y, dirs);
			break;
		case "notGate":
			ctx.drawImage(notGate, x*selW+x, y*selH+y);
			drawPipes(level, x, y, dirs);
			break;
		case "bufferGate":
			ctx.drawImage(bufferGate, x*selW+x, y*selH+y);
			drawPipes(level, x, y, dirs);
			break;
		case "orGate":
			ctx.drawImage(orGate, x*selW+x, y*selH+y);
			drawPipes(level, x, y, dirs);
			break;
		case "omniGate":
			ctx.drawImage(omniImg, x*selW+x, y*selH+y);
			drawPipes(level, x, y, dirs);
			break;
	}
}