//Window Variables
var currentPage, nextPage;
var pages = {
	INTRO: {
		name: "intro",
		data: {
			names: ["SilverNeon123", "XavierMB", "CoffeeDev"],
			namesNum: 0,
			stringNum: 0,
			stringMult: 1,
			stringTimer: 10,
			init: function() {/*TODO: PLAY AUDIO FILE*/},
			update: function(introData){
				if(introData.stringTimer-- <= 0){
					introData.stringTimer = 10;
					introData.stringNum += introData.stringMult;
					if(introData.stringNum >= introData.names[introData.namesNum].length){
						introData.stringNum = introData.names[introData.namesNum].length;
						if(introData.namesNum != 2){
							introData.stringMult *= -1;
						}
					}
					if(introData.stringNum <= 0){
						introData.stringNum = 0;
						introData.stringMult *= -1;
						introData.namesNum++;
					}
				}
			},
			getData: function(introData){
				return introData.names[introData.namesNum].substr(0, introData.stringNum);
			}
		}
	},
	MAINMENU: "mainmenu",
	GAME: "game",
	CREDITS: "credits"
};
function gameInit(){
	currentPage = pages.INTRO;
}
function gameUpdate(){
	currentPage.data.update(currentPage.data);
	switch(currentPage.name){
		case pages.INTRO.name:
			ctx.fillStyle = "#1a1a1a";
			ctx.fillRect(0, 0, canvasW, canvasH);
			ctx.fillStyle = "#0e6b0e";
			ctx.font = "72px Courier";
			ctx.translate(canvasW/2, canvasH/2);
			var textData = currentPage.data.getData(currentPage.data) + "|";
			var metric = ctx.measureText(textData);
			ctx.fillText(textData, -(metric.width/2), 0);
			ctx.translate(-(canvasW/2), -(canvasH/2));
			break;
	}
}
function slowGameUpdate(){
	
}