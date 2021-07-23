function getImage(path){ //outputs an image base on the filepath given
	var img = new Image();
	img.src = "../logicGateGame/"+path;
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
function setCookie(cname, cvalue, exdays) {
	const d = new Date();
	d.setTime(d.getTime() + (exdays*24*60*60*1000));
	let expires = "expires="+ d.toUTCString();
	document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
function getCookie(cname) {
	let name = cname + "=";
	let decodedCookie = decodeURIComponent(document.cookie);
	let ca = decodedCookie.split(';');
	for(let i = 0; i <ca.length; i++) {
		let c = ca[i];
		while (c.charAt(0) == ' ') {
			c = c.substring(1);
		}
		if (c.indexOf(name) == 0) {
			return c.substring(name.length, c.length);
		}
	}
	return "";
}
function getItem(level, userSelect, inventory=false){
	var list = null;
	if(inventory != true){
		list = level.level;
		var temp = userSelect - 6;
		var x = (temp % 12);
		var y = Math.floor(temp/12);
		for(var z = 0; z < list.length; z++){
			var item = list[z];
			if(item != null && item[2] == x && item[3] == y){
				return [item[0], item[1], x+","+y];
			}
		}
	}else{
		list = level.inv;
		for(var z = 0; z < list.length; z++){
			var item = list[z];
			if(item != null && z == userSelect){
				return [item[0], item[1], "inv"];
			}
		}
	}
	return null;
}
function getItemByName(level, name){
	for(var i = 0; i < level.level.length; i++){
		var item = level.level[i];
		if(item[0] == name){
			return item;
		}
	}
	for(var i = 0; i < level.inv.length; i++){
		var item = level.inv[i];
		if(item[0] == name){
			return item;
		}
	}
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
			var coords = userItem[2].length > 1 ? userItem[2].split(",") : userItem[2];
			if(level.level[i][2] == parseInt(coords[0]) && (userItem[2].length == 1 || level.level[i][3] == parseInt(coords[1]))){
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
function getNextItem(level, userSelect){
	var temp = userSelect - 6;
	var levelX = temp % 12;
	var levelY = Math.floor(temp/12);
	var item = level.level.filter(x => { return x[2]==levelX&&x[3]==levelY })[0];
	while(item[0]!="battery"&&item[0].toLowerCase().includes("gate")!=true){
		var dir = item[1].length > 1 ? item[1][item[1].length-1] : item[1];
		switch(dir){
			case "n":
				levelY--;
				break;
			case "s":
				levelY++;
				break;
			case "e":
				levelX++;
				break;
			case "w":
				levelX--;
				break;
		}
		item = level.level.filter(x => { return x[2]==levelX&&x[3]==levelY })[0];
		if(item==null){
			return null;
		}
	}
	return item;
}
function getPathToNext(level, userSelect){ //Similar to getNextItem but outputs the 2d array for particles
	var ret = [];
	var temp = userSelect - 6;
	var levelX = temp % 12;
	var levelY = Math.floor(temp/12);
	var item = level.level.filter(x => { return x[2]==levelX&&x[3]==levelY })[0];
	var prevDir = item[1].length > 1 ? item[1][item[1].length-1] : item[1];
	while(item[0]!="battery"&&item[0].toLowerCase().includes("gate")!=true){
		var dir = item[1].length > 1 ? item[1][item[1].length-1] : item[1];
		switch(dir){
			case "n":
				levelY--;
				break;
			case "s":
				levelY++;
				break;
			case "e":
				levelX++;
				break;
			case "w":
				levelX--;
				break;
		}
		if(dir != prevDir){
			prevDir = dir;
			ret.push([levelX+0.5, levelY+0.5]);
		}
		item = level.level.filter(x => { return x[2]==levelX&&x[3]==levelY })[0];
		if(item==null){
			break;
		}
	}
	if(ret.length == 0){
		ret.push([levelX+0.5, levelY+0.5]);
	}
	return ret;
}