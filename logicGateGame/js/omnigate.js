

class Omnigate extends Gate{
	ID = null;
	oldLevel = null;
	omniLevel = null;
	
	constructor(dirs, coords, gateType, ID){
		super(dirs, coords, gateType);
		this.ID = ID;
	}
	
	solveGate(level, selW){
		this.getInputs(level);
		if(this.input[0] == 1){
			return this.genOutput(level, selW, 1);
		}
	}
}