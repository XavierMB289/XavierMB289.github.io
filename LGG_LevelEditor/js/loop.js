//LOOP VARIABLES
var tile, unselected; //images

var loopDelaySet = 6;
var loopDelay = loopDelaySet;

window.onload = function(){
	canvas.width = document.body.clientWidth; //document.width is obsolete
	canvas.height = document.body.clientHeight; //document.height is obsolete
	canvasW = canvas.width;
	canvasH = canvas.height;
	
	tile = getImage("img/tiles.png");
	unselected = getImage("img/unselected_slot.png");
	
	wireInit();
	gateInit();
	gameInit();
	
	update();
};
function update() {
	
	var tileW = tile.width;
	var tileH = tile.height;
	
	if(loopDelay-- <= 0){
		ctx.fillStyle = "#1a1a1a";
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		ctx.translate(10, canvasH/2-4*tileW-4);
		for(let x = 0; x < 12; x+=1){
			for(let y = 0; y < 8; y+=1){
				ctx.drawImage(tile, x*tileW+x, y*tileH+y);
			}
		}
		ctx.translate(-10, -(canvasH/2-4*tileW-4));
		
		ctx.translate(canvasW-7*tileW-7, canvasH/2-4*tileW-4);
		for(let x = 0; x < 6; x+=1){
			for(let y = 0; y < 8; y+=1){
				ctx.drawImage(tile, x*tileW+x, y*tileH+y);
				ctx.drawImage(unselected, x*tileW+x, y*tileH+y);
			}
		}
		ctx.translate(-(canvasW-7*tileW-7), -(canvasH/2-4*tileW-4));
		slowGameUpdate();
		loopDelay = loopDelaySet;
	}
	
	gameUpdate();
	
	var myMainLoop = window.requestAnimationFrame( update );
	
};