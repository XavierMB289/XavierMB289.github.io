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
		loadGameLevel(fakeLevel, false);
		omnigates.push(this);
		inOmnigate = true;
	}
	
	onReturn(level){
		level[this.ID] = level.level;
		omnigates.pop();
		if(omnigates.length <= 0){
			inOmnigate = false;
		}
		return this.oldLevel;
	}
	
	genOutput(level, selW){
		
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