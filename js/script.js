function setCookie(name, value, days){
	var d = new Date();
	d.setTime(d.getTime() + (days*24*60*60*1000));
	var expires = "expires="+d.toUTCString();
	document.cookie = name+"="+value+";"+expires+";path=/";
}
function setSimpleCookie(name, value){
	document.cookie = name+"="+value;
}
function getCookie(cname){
	var name = cname+"=";
	var decoded = decodeURIComponent(document.cookie);
	var ca = decoded.split(";");
	for(var i = 0; i < ca.length; i++){
		var c = ca[i];
		while(c.charAt(0) == " "){
			c = c.substring(1);
		}
		if(c.indexOf(name) == 0){
			return c.substring(name.length, c.length);
		}
	}
	return "";
}
function ajax(file, args, id){
	var xhttp = new XMLHttpRequest();
	if (window.XMLHttpRequest) {
    	xmlhttp = new XMLHttpRequest();
 	} else {
    	xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	}
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			document.getElementById(id).innerHTML = this.responseText;
		}
	};
	xhttp.open("POST", file, true);
	xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhttp.send(args);
}

document.onload = function(){
	ajax("/navbar.html", "", "body");
};