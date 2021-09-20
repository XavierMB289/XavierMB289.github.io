//LOOP VARIABLES
var tile; //images

var loopDelaySet = 6;
var loopDelay = loopDelaySet;

var state = null;

var menuLevel = {"level": []};

window.onload = function(){
	var win = window,
		doc = document,
		docElem = doc.documentElement,
		body = doc.getElementsByTagName('body')[0];
    canvas.width = win.innerWidth || docElem.clientWidth || body.clientWidth;
    canvas.height = win.innerHeight|| docElem.clientHeight|| body.clientHeight;
	canvasW = canvas.width;
	canvasH = canvas.height;
	
	tile = getImage("img/tiles.png");
	
	wireInit();
	gateInit();
	gameInit();
	
	state = loopMenu;
	document.onkeyup = menuKeyUp;
	
	menuLevel.level = [
		["wire", ["s","e"], 0, 0, false],
		["wire", ["w","s"], 1, 0, false],
		["wire", ["n","s"], 2, 0, false],
		["wire", ["s","e"], 4, 0, false],
		["wire", ["w","s"], 5, 0, false],
		["wire", ["n","e"], 6, 0, false],
		["wire", ["n,w,s",null], 7, 0, false],
		["wire", ["s,e,n",null], 0, 1, false],
		["wire", ["n","w"], 1, 1, false],
		["wire", ["n","e"], 2, 1, false],
		["wire", ["w","e"], 3, 1, false],
		["wire", ["s,e,n",null], 4, 1, false],
		["wire", ["s,w,n",null], 5, 1, false],
		["wire", ["n","e"], 6, 1, false],
		["wire", ["w","n"], 7, 1, false]
	];
	
	update();
};
function update() {
	
	var tileW = tile.width;
	var tileH = tile.height;
	
	ctx.font = "20px Caveat";
	ctx.fillStyle = "#FFFFFF";
	
	if(loopDelay-- <= 0){
		ctx.fillStyle = "#1a1a1a";
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		
		state(tileW, tileH);
		
		loopDelay = loopDelaySet;
	}
	
	var myMainLoop = window.requestAnimationFrame( update );
	
};

function loopMenu(tileW, tileH){
	ctx.translate(canvasW/2, canvasH/4);
	ctx.font = "128px Caveat";
	ctx.fillStyle = "#FFFF00";
	var metric = ctx.measureText("Logistics");
	ctx.fillText("Logistics", -(metric.width/2), 0);
	ctx.translate(-(canvasW/2), -(canvasH/4));
	
	ctx.translate(canvasW/2-4*tileW+4, canvasH/2);
	for(var x = 0; x < 8; x++){
		for(var y = 0; y < 2; y++){
			ctx.drawImage(tile, x*tileW+x, y*tileH+y);
		}
	}
	for(var i = 0; i < menuLevel.level.length; i++){
		var x = menuLevel.level[i][2];
		var y = menuLevel.level[i][3];
		var dirs = menuLevel.level[i][1];
		drawPipes(menuLevel, x, y, dirs, false);
	}
	ctx.translate(-(canvasW/2-4*tileW+4), -(canvasH/2));
}

function menuKeyUp(e){
	if(e.key.toLowerCase() == "enter"){
		state = loopGame;
		document.onkeyup = gameKeyUp;
	}
}

function loopGame(tileW, tileH){
	ctx.translate(canvasW/2-6*tileW-6,20);
	for(let x = 0; x < 12; x+=1){
		for(let y = 0; y < 8; y+=1){
			ctx.drawImage(tile, x*tileW+x, y*tileH+y);
		}
	}
	ctx.translate(-(canvasW/2-6*tileW-6),-20);
	slowGameUpdate();
}