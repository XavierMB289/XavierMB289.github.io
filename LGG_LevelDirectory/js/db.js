var config;

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
	var user = document.getElementsByTagName("input")[0].value;
	var pass = document.getElementsByTagName("input")[1].value;
	if(user != "" && pass != ""){
		const r = new snoowrap({
		userAgent: "Logistics Game Directory by u/SilverNeon123",
		clientId: config.clientID,
		clientSecret: config.clientSecret,
		refreshToken: config.refreshToken
	});
		r.getNew().map(post => post.title).then(console.log);
	}
}
ajaxRequest("oauth_config.json", db_init);