var pipe = null;
var pipeOutput = null;
var energizedPipe = null;
var gatePipe = null;
var gatePipeOutput = null;
var energizedGatePipe = null

function wireInit(){
	pipe = getImage("img/pipe.png");
	pipeOutput = getImage("img/pipe_output.png");
	energizedPipe = getImage("img/pipe_energized.png");
	gatePipe = getImage("img/gate_pipe.png");
	gatePipeOutput = getImage("img/gate_pipe_output.png");
	energizedGatePipe = getImage("img/gate_pipe_energized.png");
}
function drawPipes(level, x, y, dirs, gate = true){
	dirs = dirs.includes(",") ? dirs.split(",") : [dirs];
	var energy = null;
	if(getItemIndex(level, x, y, true) != null){
		energy = level.inv[getItemIndex(level, x, y, true)][4];
	}else if(getItemIndex(level, x, y) != null){
		energy = level.level[getItemIndex(level, x, y)][4];
	}else{
		energy = userItem[4];
	}
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
			if(j == dirs.length-1){
				ctx.drawImage(gatePipeOutput, -selW/2, -selH/2);
			}else{
				ctx.drawImage(gatePipe, -selW/2, -selH/2);
			}
			if(energy != false){
				ctx.drawImage(energizedGatePipe, -selW/2, -selH/2);
			}
		}else{
			if(j == dirs.length - 1){
				ctx.drawImage(pipeOutput, -selW/2, -selH/2);
			}else{
				ctx.drawImage(pipe, -selW/2, -selH/2);
			}
			if(energy != false){
				ctx.drawImage(energizedPipe, -selW/2, -selH/2);
			}
		}
		ctx.restore();
	}
}