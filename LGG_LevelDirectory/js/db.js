var config;
var page = 0;
var loopIndex = 0;
var r = null;

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
		userAgent: "Logistics Game Directory by u/SilverNeon123",
		clientId: config.clientID,
		clientSecret: config.clientSecret,
		refreshToken: config.refreshToken
	});
	getData();
}
function getData(){
	r.getSubreddit('logistics_lgg').getNew().then(tableLoop);
}
function tableLoop(input){
	if(!(page*10 <= loopIndex && page*10+10 > loopIndex)){
		return;
	}
	var level = toLevel(input[0].selftext);
	console.log(input[0]);
	var tb = document.getElementsByTagName("tbody")[0];
	document.getElementsByTagName("tbody")[0].innerHTML = document.getElementsByTagName("tbody")[0].innerHTML + "<tr><td>"+level.name+"</td><td>"+input[0].author.name+"</td><td><button onclick='playLevel(\""+input[0].name.split("_")[1]+"\")'>PLAY</button></td></tr>";
	loopIndex++;
}
function playLevel(postID){
	var data = r.getSubmission(postID).selftext.then(post => {
		setCookie("customLevel", JSON.toString(post.replaceAll("\\", "")), 2);
		window.location = "../logicGateGame/custom.html";
	});
}
function toLevel(input){
	var level = input.replaceAll("\\", "");
	level = JSON.parse(level);
	return level;
}
ajaxRequest("oauth_config.json", db_init);