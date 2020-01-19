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

$(document).ready(function(){
	$('.sidenav').sidenav();
	if(getCookie("username") != ""){
		$(".userHide").hide();
	}
	$(".nav-wrapper ul li").click(function(event){
		console.log($(event.target).html().trim());
		$.ajax({
			url:"pages/api.html",
			success: function(result){
				console.log(result);
			}
		});
	});
});