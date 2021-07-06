function getImage(path){ //outputs an image base on the filepath given
	var img = new Image();
	img.src = path;
	return img;
}
function getLevel(path, callback){
	path = "https://xaviermb289.github.io/logicGateGame/" + path;
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			var result = this.responseText.trim();
			callback(JSON.parse(result));
		}
	};
	xhttp.open("GET", path, true);
	xhttp.send();
}
function getItem(level, userSelect, inventory=false){ //TODO: fix the pickup
	var list = null;
	if(inventory != true){
		list = level.level;
		var temp = userSelect - 6;
		var x = (temp % 12)-1;
		var y = Math.floor(temp/12)-1;
		for(var z = 0; z < list.length; z++){
			var item = list[z];
			if(item[2] == x && item[3] == y){
				
				return [item[0], item[1], x+","+y];
			}
		}
	}else{
		list = level.inv;
		for(var z = 0; z < list.length; z++){
			var item = list[z];
			if(item[2] == userInput){
				return [item[0], item[1], "inv"];
			}
		}
	}
}