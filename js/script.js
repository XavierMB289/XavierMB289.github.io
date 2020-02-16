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

function navbarClick(event){
	var text = $(event.target).remove(".material-icons").text().trim().split(" ")[1].toLowerCase();
	console.log("*"+text+"*");
	$.ajax({
		url: "pages/"+text+".html",
		success: function(result){
			$(".body").html(result);
		}
	});
}

function readFile(file, line){
	$.ajax({
		url: file,
		success: function(result){
			return result.split(/\r?\n/g)[line];
		}
	});
}

function checkURL(url) {
    return(url.match(/\.(jpeg|jpg|gif|png)$/) != null);
}

$(document).ready(function(){
	$('.sidenav').sidenav();
	if(getCookie("username") != ""){
		$(".userHide").hide();
	}
	$(".nav-wrapper ul li").click(navbarClick);
	$(".sidenav li").click(navbarClick);
	
	
	//Getting the items and displaying
	var queries = 1;
	for(var index = 0; index < queries; index++){
		var item = readFile("/items/items.txt", index);
		console.log(item);
		var title = readFile("/items/"+item+"/desc.txt", 0);
		var desc = readFile("/items/"+item+"/desc.txt", 1);
		var id = readFile("/items/"+item+"/desc.txt", 2);
		$(".body").html(
			"<div class='col s12 m6 l4'>"+
				"<div class='card'>"+
					"<div class='card-image waves-effect waves-block waves-light'>"+
						"<img class='activator' src='/items/"+item+"/icon.png'>"+
					"</div>"+
					"<div class='card-content'>"+
						"<span class='card-title activator grey-text text-darken-4'>"+title+"<i class='material-icons right'>more_vert</i></span>"+
						"<p><a href='/pages/buy.html?id="+id+"'></a></p>"+
					"</div>"+
					"<div class='card-reveal'>"+
						"<span class='card-title grey-text text-darken-4'>"+title+"<i class='material-icons right'>close</i></span>"+
						"<p>"+desc+"</p>"+
					"</div>"+
				"</div>"+
			"</div>"
		);
	}
});