//LOOP VARIABLES

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
	
	gameInit();
	
	update();
};
function update() {
	
	if(loopDelay-- <= 0){
		slowGameUpdate();
		loopDelay = loopDelaySet;
	}
	
	gameUpdate();
	
	var myMainLoop = window.requestAnimationFrame( update );
	
};