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
		var x = (temp % 12);
		var y = Math.floor(temp/12);
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
	return null;
}
function removeItem(level, x, y, inventory=false){
	var list = null;
	if(inventory != true){
		list = level.level;
		for(var z = 0; z < list.length; z++){
			var item = list[z];
			if(item[2] == x && item[3] == y){
				level.level.splice(z, 1);
				return level;
			}
		}
	}else{
		list = level.inv;
		for(var z = 0; z < list.length; z++){ //TODO: fix the removal of objects to actually subtract from item count
			var item = list[z];
			if(item[2] == x+y){
				level.inv.splice(z, 1);
				return level;
			}
		}
	}
}
function addItem(level, userItem, x, y){
	level.level.push([userItem[0], userItem[1], x, y]);
	return level;
}
function addToInv(level, userItem){
	for(var index = 0; index < level.inv.length; index++){ //Checking if there is already one...
		var item = level.inv[index];
		if(item[0] == userItem[0] && item[1] == userItem[1]){
			level.inv[index][3] += 1;
			return level;
		}
	}
	level.inv.push([userItem[0], userItem[1], x+y, 1]); //If not, add it...
	return level;
}