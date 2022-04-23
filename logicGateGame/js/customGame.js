winFunction = function(level, currentLevel){
	ctx.translate(canvasW/2, canvasH/4);
	ctx.font = "128px Caveat";
	ctx.fillStyle = "#000000";
	ctx.globalAlpha = 0.2;
	ctx.fillRect(0, 0, canvasW, canvasH);
	ctx.globalAlpha = 1.0;
	ctx.fillStyle = "#FFFF00";
	var metric = ctx.measureText("Congratulations!");
	ctx.fillText("Congratulations!", -(metric.width/2), 0);
	ctx.font = "36px Caveat";
	metric = ctx.measureText("Refresh to play again!");
	ctx.fillText("Congratulations!", -(metric.width/2), 80);
};
customGameInit = function(){
	const text = navigator.clipboard.readText();
	console.log(text);
};