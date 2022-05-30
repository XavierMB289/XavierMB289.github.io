winFunction = function(level, currentLevel){
	ctx.font = "128px Caveat";
	ctx.fillStyle = "#000000";
	ctx.globalAlpha = 0.2;
	ctx.fillRect(0, 0, canvasW, canvasH);
	ctx.globalAlpha = 1.0;
	ctx.fillStyle = "#FFFF00";
	ctx.translate(canvasW/2, canvasH/4);
	var metric = ctx.measureText("Congratulations!");
	ctx.fillText("Congratulations!", -(metric.width/2), 0);
	ctx.font = "36px Caveat";
	metric = ctx.measureText("Refresh to play again!");
	ctx.fillText("Refresh to play again!", -(metric.width/2), 80);
	ctx.translate(-(canvasW/2), -(canvasH/4));
};
customGameInit = function(){
	var lvl = getCookie("customLevel");
	if(lvl != null && lvl != ""){
		console.log("pre-Level: "+lvl);
		loadGameLevel(JSON.parse(lvl));
		console.log("post-Level: "+lvl);
	}else{
		titlePage = "No Game Found..."
	}
};