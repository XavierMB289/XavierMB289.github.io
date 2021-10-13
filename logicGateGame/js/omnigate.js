var inOmnigate = false;
var omnigates = [];
var fakeLevel = null;

class Omnigate extends Gate{
	ID = null;
	oldLevel = null;
	
	constructor(dirs, coords, gateType, ID){
		super(dirs, coords, gateType);
		this.ID = ID;
	}
	
	onUserSelect(level){
		this.oldLevel = level.level;
		//Setting up a fakelevel to use with game.loadgamelevel
		fakeLevel = level;
		fakeLevel.level = level[this.ID];
		omnigates.push(this);
		inOmnigate = true;
		return loadGameLevel(fakeLevel, false);
	}
	
	onReturn(level, output=false){
		level[this.ID] = level.level;
		omnigates.pop();
		if(omnigates.length <= 0){
			inOmnigate = false;
		}
		level.level = this.oldLevel;
		if(output != false){
			var userSelect = this.coords[0]+(this.coords[1]*12)+6;
			var next = getNextGate(level, userSelect);
			addNode(this.coords[0]+.5, this.coords[1]+.5, selW, getImage("img/power.png"), getPathToNext(level, userSelect), 1, function(){
				if(next != null){
					if(next[0].toLowerCase().includes("gate")){
						return next[5].solveGate(level, selW);
					}else if(next[0].toLowerCase().includes("output")){
						return omnigates[omnigates.length-1].onReturn(level, true);
					}
				}
			});
		}
		return level;
	}
	
	genOutput(level, selW){
		level = this.onUserSelect(level);
		var input = getItemByName(level, "input");
		var userSelect = input[2]+(input[3]*12)+6;
		var next = getNextGate(level, userSelect);
		addNode(input[2]+.5, input[3]+.5, selW, getImage("img/power.png"), getPathToNext(level, userSelect), 1, function(){
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
		if(this.inputs[0] == 1 || this.input[1] == 1){
			return this.genOutput(level, selW);
		}
	}
	
	getID(){
		return this.ID;
	}
	
	getOldLevel(){
		return this.oldLevel;
	}
}