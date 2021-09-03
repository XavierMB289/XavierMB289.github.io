//LOOP VARIABLES
var tile; //images

var loopDelaySet = 6;
var loopDelay = loopDelaySet;

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
	
	update();
};
function update() {
	
	var tileW = tile.width;
	var tileH = tile.height;
	
	if(loopDelay-- <= 0){
		ctx.fillStyle = "#1a1a1a";
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		ctx.translate(canvasW/2-6*tileW-6,20);
		for(let x = 0; x < 12; x+=1){
			for(let y = 0; y < 8; y+=1){
				ctx.drawImage(tile, x*tileW+x, y*tileH+y);
			}
		}
		ctx.translate(-(canvasW/2-6*tileW-6),-20);
		slowGameUpdate();
		loopDelay = loopDelaySet;
	}
	
	gameUpdate();
	
	var myMainLoop = window.requestAnimationFrame( update );
	
};