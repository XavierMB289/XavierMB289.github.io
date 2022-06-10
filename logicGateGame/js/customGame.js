winFunction = function(level, currentLevel){
	ctx.font = "128px Caveat";
	ctx.fillStyle = "#000000";
	ctx.globalAlpha = 0.2;
	ctx.fillRect(0, 0, canvasW, canvasH);
	ctx.globalAlpha = 1.0;
	ctx.fillStyle = "#FFFF00";
	ctx.translate(canvasW/2, canvasH/4);
	var uploadable = getCookie("uploadable");
	var metric = ctx.measureText("Congratulations!");
	ctx.fillText("Congratulations!", -(metric.width/2), 0);
	ctx.font = "36px Caveat";
	if(uploadable != true){
		metric = ctx.measureText("Refresh to play again!");
		ctx.fillText("Refresh to play again!", -(metric.width/2), 80);
	}else{
		metric = ctx.measureText("Your level has been uploaded!");
		ctx.fillText("Your level has been uploaded!", -(metric.width/2), 80);
		sendLevel();
	}
	ctx.translate(-(canvasW/2), -(canvasH/4));
};
customGameInit = function(){
	var lvl = getCookie("customLevel");
	if(lvl != null && lvl != ""){
		loadGameLevel(JSON.parse(lvl));
		console.log("Level: "+lvl);
	}else{
		titlePage = "No Game Found...";
	}
};
var r, done;
function ajaxRequest(path, callback){
	path = "https://xaviermb289.github.io/LGG_LevelDirectory/" + path;
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			var result = this.responseText.trim();
			callback(JSON.parse(result));
		}else if(this.status == 404){
			//If there is no level found
		}
	};
	xhttp.open("GET", path, true);
	xhttp.send();
}
function db_init(oauth){
	config = oauth;
	r = new snoowrap({
		userAgent: "Custom Game Submission by u/SilverNeon123",
		clientId: config.clientID,
		clientSecret: config.clientSecret,
		refreshToken: config.refreshToken
	});
}
function sendLevel(){
	if(done != true){ //safety to make sure it only happens once
		done = true;
		ajaxRequest("oauth_config.json", db_init);
		var lvl = getCookie("customLevel");
		r.getSubreddit('some_subreddit_name').submitSelfpost({title: level.name, text: lvl});
	}
}