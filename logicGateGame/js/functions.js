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
function getItemImage(level, x, y){
	var list = level.level;
	for(var z = 0; z < list.length; z++){
		var item = list[z];
		if(item[2] == x && item[3] == y){
			return item[4];
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
	var temp = [userItem[0], userItem[1], x, y];
	level.level.push(temp);
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
function returnItem(level, userItem){
	if(userItem[2]=="inv"){
		return addToInv(level, userItem);
	}
	var coords = userItem[2].split(",");
	return addItem(level, userItem, parseInt(coords[0]), parseInt(coords[1]));
}
function alterItem(level, userItem, newImages){
	if(userItem[2]!="inv"){
		for(var i = 0; i < level.level.length; i++){
			var coords = userItem[2].split(",");
			if(level.level[i][2] == parseInt(coords[0]) && level.level[i][3] == parseInt(coords[1])){
				var passed = false;
				for(var j = 0; j < newImages.length; j++){
					if(newImages[j] == level.level[i][4] && !passed && j != newImages.length-1){ //That way it can't "pass" the last image
						passed = true;
					}else if(passed != false){
						level.level[i][4] = newImages[j];
						return level;
					}
				}
				if(passed != true){
					level.level[i][4] = newImages[0];
				}
			}
		}
	}
	return level;
}