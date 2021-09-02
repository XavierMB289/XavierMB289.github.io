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
function thresh(pointNum, checkNum, thresh){
	return Math.abs(pointNum - checkNum) < thresh;
}
function getItem(level, x, y, inventory=false){
	var list = null;
	if(inventory != true){
		list = level.level;
		return list.filter(z => { return z[2]==x&&z[3]==y })[0];
	}else{
		list = level.inv;
		for(var i = 0; i < list.length; i++){
			var z = list[i];
			if(z!=null&&i==x+y){
				return z;
			}
		}
	}
	return null;
}
function getItemIndex(level, x, y, inventory=false){
	var list = null;
	if(inventory != true){
		list = level.level;
		for(var i = 0; i < list.length; i++){
			var z = list[i];
			if(z[2]==x&&z[3]==y){
				return i;
			}
		}
	}else{
		list = level.inv;
		for(var i = 0; i < list.length; i++){
			var z = list[i];
			if(z!=null&&i==x+y){
				return i;
			}
		}
	}
	return null;
}
function getItemByName(level, name, inventory=false){
	if(inventory != true){
		return level.level.filter(z => { return z[0]==name; })[0];
	}else{
		return level.inv.filter(z => { return z[0]==name; })[0];
	}
}
function getItemImage(level, x, y){
	return (level.level.filter(z => { return z[2]==x&&z[3]==y; })[0])[5];
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
	var temp = [userItem[0], userItem[1], x, y, false, "justInCase"];
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
			var coords = [userItem[2], userItem[3]];
			if(level.level[i][2] == parseInt(coords[0]) && (userItem[2].length == 1 || level.level[i][3] == parseInt(coords[1]))){
				var passed = false;
				for(var j = 0; j < newImages.length; j++){
					if(newImages[j] == level.level[i][5] && !passed && j != newImages.length-1){ //That way it can't "pass" the last image
						passed = true;
					}else if(passed != false){
						level.level[i][5] = newImages[j];
						return level;
					}
				}
				if(passed != true){
					level.level[i][5] = newImages[0];
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
	var item = getItem(level, levelX, levelY);
	var prevDir = item[1].length > 1 ? item[1][item[1].length-1] : item[1];
	do{
		var dir = item[1].length > 1 ? item[1][item[1].length-1] : item[1];
		switch(dir){
			case "n":
				if(prevDir=="s"){
					return item;
				}
				levelY--;
				break;
			case "s":
				if(prevDir=="n"){
					return item;
				}
				levelY++;
				break;
			case "e":
				if(prevDir=="w"){
					return item;
				}
				levelX++;
				break;
			case "w":
				if(prevDir=="e"){
					return item;
				}
				levelX--;
				break;
		}
		item = getItem(level, levelX, levelY);
		prevDir = dir;
		if(item==null){
			return null;
		}
	}while(item[0]!="battery"&&item[0].toLowerCase().includes("gate")!=true);
	return item;
}
function getPathToNext(level, userSelect){ //Similar to getNextItem but outputs the 2d array for particles
	var ret = [];
	var temp = userSelect - 6;
	var levelX = temp % 12;
	var levelY = Math.floor(temp/12);
	var item = getItem(level, levelX, levelY);
	var prevDir = item[1].length > 1 ? item[1][item[1].length-1] : item[1];
	do{
		var dir = item[1].length > 1 ? item[1][item[1].length-1] : item[1];
		if(dir != prevDir){
			prevDir = dir;
			ret.push([levelX+0.5, levelY+0.5]);
		}
		switch(dir){
			case "n":
				if(prevDir=="s"){
					return item;
				}
				levelY--;
				break;
			case "s":
				if(prevDir=="n"){
					return item;
				}
				levelY++;
				break;
			case "e":
				if(prevDir=="w"){
					return item;
				}
				levelX++;
				break;
			case "w":
				if(prevDir=="e"){
					return item;
				}
				levelX--;
				break;
		}
		item = getItem(level, levelX, levelY);
		if(item==null){
			break;
		}
	}while(item[0]!="battery"&&item[0].toLowerCase().includes("gate")!=true);
	ret.push([levelX+0.5, levelY+0.5]); //NO MATTER WHAT: adds last location
	return ret;
}
function energize(level, x, y){
	var index = getItemIndex(level, x, y);
	level.level[index][4] = true;
	return level;
}
function deenergize(level, x, y){
	var index = getItemIndex(level, x, y);
	level.level[index][4] = false;
	return level;
}
function getPrevItem(level, item){ //WARNING! ONLY RETURNS ONE PREVIOUS ITEM!
	var dir = item[1].length > 1 ? item[1][0] : item[1];
	var x = item[2];
	var y = item[3];
	switch(dir){
		case "n":
			y--;
			break;
		case "s":
			y++;
			break;
		case "e":
			x++;
			break;
		case "w":
			x--;
			break;
	}
	return getItem(level, x, y);
}
function getPrevItemIndex(level, item){
	var dir = item[1].length > 1 ? item[1][0] : item[1];
	var x = item[2];
	var y = item[3];
	switch(dir){
		case "n":
			y--;
			break;
		case "s":
			y++;
			break;
		case "e":
			x++;
			break;
		case "w":
			x--;
			break;
	}
	return getItemIndex(level, x, y);
}