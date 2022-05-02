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
}
function form_submit(){
	const otherRequester = new snoowrap({
		userAgent: "Logistics article reader by u/SilverNeon123",
		clientId: config.clientID,
		clientSecret: config.clientSecret,
		username: 'put your username here',
		password: 'put your password here'
	});
}
ajaxRequest("oauth_config.json", db_init);