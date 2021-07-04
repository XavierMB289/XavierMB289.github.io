function getImage(path){ //outputs an image base on the filepath given
	var img = new Image();
	img.src = path;
	return img;
}
function getLevel(path, callback){
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			var result = this.responseText.trim();
			console.log(result);
			callback(JSON.parse(result));
		}
	};
	xhttp.open("GET", path, true);
	xhttp.send();
}
