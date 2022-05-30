//LOOP VARIABLES
var tile, left, right; //images

var loopDelaySet = 6;
var loopDelay = loopDelaySet;

var menuLevel = {"level": []};
var currentMenu = 0;
var loopState = null;

var playTitle = titlePage; //Menu Text for "Logistics" or "custom level editor"

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
	left = getImage("img/left_comma.png");
	right = getImage("img/right_period.png");
	
	wireInit();
	gateInit();
	initAudio();
	gameInit();
	
	document.onkeyup = menuKeyUp;
	loopState = loopBackground;
	
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
		
		loopState(tileW, tileH);
		updateAudio();
		
		loopDelay = loopDelaySet;
	}
	
	var myMainLoop = window.requestAnimationFrame( update );
	
};

function loopBackground(tileW, tileH){
	ctx.translate(canvasW/2, canvasH/4);
	ctx.font = "128px Caveat";
	ctx.fillStyle = "#FFFF00";
	var metric = ctx.measureText(titlePage);
	ctx.fillText(titlePage, -(metric.width/2), 0);
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
	ctx.drawImage(left, selW*-2, selW*3.5);
	ctx.drawImage(right, selW*9, selW*3.5);
	ctx.translate(-(canvasW/2-4*tileW+4), -(canvasH/2));
}

function menuKeyUp(e){
	var keyName = e.key.toLowerCase();
	switch(keyName){
		case "enter":
			if(currentMenu == 0){
				document.onkeyup = gameKeyUp;
				loopState = loopGame;
				return;
			}else if(currentMenu == 1){
				window.location = "../LGG_LevelEditor/index.html";
			}else{
				window.location = "../LGG_LevelDirectory/index.html";
			}
			break;
		case "<":
		case ",":
			currentMenu = currentMenu > 0 ? currentMenu - 1 : 2;
			break;
		case ">":
		case ".":
			currentMenu = currentMenu < 2 ? currentMenu + 1 : 0;
			//playTitle = titlePage;
			//titlePage = "Level Editor";
			//document.onkeyup = editorKeyUp;
			break;
	}
	if(currentMenu == 0){
		titlePage = playTitle;
	}else if(currentMenu == 1){
		titlePage = "Level Editor";
	}else{
		titlePage = "Custom Level Directory";
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
	updateAudio();
}