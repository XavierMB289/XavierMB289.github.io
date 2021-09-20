var pipe = null;
var pipeOutput = null;
var energizedPipe = null;
var pipePip = null;
var gatePipe = null;
var gatePipeOutput = null;
var energizedGatePipe = null

function wireInit(){
	pipe = getImage("img/pipe.png");
	pipeOutput = getImage("img/pipe_output.png");
	energizedPipe = getImage("img/pipe_energized.png");
	pipePip = getImage("img/pipe_pip.png");
	gatePipe = getImage("img/gate_pipe.png");
	gatePipeOutput = getImage("img/gate_pipe_output.png");
	energizedGatePipe = getImage("img/gate_pipe_energized.png");
}
function drawPipes(level, x, y, dirs, gate = true){
	var inputDir = null;
	if(dirs[0] != null){
		inputDir = dirs[0].length > 1 ? dirs[0].split(",") : [dirs[0]];
	}
	var outputDir = null;
	if(dirs[1] != null){
		outputDir = dirs[1].length > 1 ? dirs[1].split(",") : [dirs[1]];
	}
	
	var energy = false;
	var energyItem = null;
	if(getItemIndex(level, x, y) != null){
		energyItem = level.level[getItemIndex(level, x, y)];
		energy = energyItem[4];
	}
	var nextEnergy = false;
	if(getNextItemIndex(level, energyItem) != null){
		nextEnergy = getNextItem(level, energyItem)[4];
	}
	
	if(inputDir != null){
		for(var j = 0; j < inputDir.length; j++){
			ctx.save();
			ctx.translate(x*selW+x+(selW/2), y*selH+y+(selH/2));
			switch(inputDir[j]){
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
				if(energy != false){
					ctx.drawImage(energizedGatePipe, -selW/2, -selH/2);
				}
			}else{
				ctx.drawImage(pipe, -selW/2, -selH/2);
				if(energy != false){
					ctx.drawImage(energizedPipe, -selW/2, -selH/2);
				}
				ctx.drawImage(pipePip, -selW/2, -selH/2);
			}
			ctx.restore();
		}
	}
	
	if(outputDir != null){
		for(var j = 0; j < outputDir.length; j++){
			ctx.save();
			ctx.translate(x*selW+x+(selW/2), y*selH+y+(selH/2));
			switch(outputDir[j]){
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
				ctx.drawImage(gatePipeOutput, -selW/2, -selH/2);
				if(nextEnergy != false){
					ctx.drawImage(energizedGatePipe, -selW/2, -selH/2);
				}
			}else{
				ctx.drawImage(pipeOutput, -selW/2, -selH/2);
				if(nextEnergy != false){
					ctx.drawImage(energizedPipe, -selW/2, -selH/2);
				}
				ctx.drawImage(pipePip, -selW/2, -selH/2);
			}
			ctx.restore();
		}
	}
}