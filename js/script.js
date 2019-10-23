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

document.addEventListener('DOMContentLoaded', function() {
	var elems = document.querySelectorAll('.sidenav');
	var instances = M.Sidenav.init(elems);
});

$(document).ready(function(){
	$('.sidenav').sidenav();
	if(getCookie("username") != ""){
		$(".userHide").hide();
	}
	$(".nav-wrapper ul li").click(function(){
		console.log($(this).prop("page"));
		$.ajax({
			url:"pages/api.html",
			success: function(result){
				console.log(result);
			}
		});
	});
});