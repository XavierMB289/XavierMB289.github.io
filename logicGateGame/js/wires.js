var pipe = null;
var gatePipe = null;

function wireInit(){
	gatePipe = getImage("img/gate_pipe.png");
	pipe = getImage("img/pipe.png");
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