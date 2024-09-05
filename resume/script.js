var main = function(){
	animateDir = "";
	currentMenu = '.main-menu';
	$(document).keypress(function(event){
		currentLi = $('.selected');
		nextLi = currentLi.next();
		prevLi = currentLi.prev();
		temp = currentLi.html();
		menu = $('#menu-wrapper');
		submenu = currentLi.attr("goto");
    
		if(prevLi.length === 0){
			prevLi = $(currentMenu).last();
		}
		if(nextLi.length === 0){
			nextLi = $(currentMenu).first();
		}
    
		if(event.which === 119){
			currentLi.removeClass('selected');
			prevLi.addClass('selected');
		}else if(event.which === 115){
			currentLi.removeClass('selected');
			nextLi.addClass('selected');
		}else if(event.which === 100){
			if(temp === 'About Me'){
				menu.animate({
					top: "-50%"
				});
				$("#"+submenu).css({
					"top": "150%",
					"left": "50%",
					"visibility": "visible"
				});
				$("#"+submenu).animate({
					top: "50%"
				}, 600);
				animateDir = "top";
				currentMenu = '.hidden';
			}else if(temp === "Projects"){
				menu.animate({
					top: "150%"
				});
				$("#"+submenu).css({
					"top": "-50%",
					"left": "50%",
					"visibility": "visible"
				});
				$("#"+submenu).animate({
					top: "50%"
				}, 600);
				animateDir = "bottom";
				currentMenu = '.hidden';
			}else if(temp === "Skills"){
				menu.animate({
					left: "-50%"
				});
				$("#"+submenu).css({
					"left": "150%",
					"top": "50%",
					"visibility": "visible"
				});
				$("#"+submenu).animate({
					left: "50%"
				}, 600);
				animateDir = "left";
				currentMenu = '.hidden';
			}else if(temp === "Work History"){
				menu.animate({
					left: "150%"
				});
				$("#"+submenu).css({
					"left": "-50%",
					"top": "50%",
					"visibility": "visible"
				});
				$("#"+submenu).animate({
					left: "50%"
				}, 600);
				animateDir = "right";
				currentMenu = '.hidden';
			}else{
				alert("You seemed to have found a hidden button");
			}
      
			$(currentMenu).first().addClass('selected');
		}else if(event.which === 97){
			if(currentMenu == '.hidden'){
				if(animateDir === "top"){
					$("#"+submenu).animate({
						top: "150%"
					});
					menu.css({
						"top": "-50%",
						"left": "50%",
						"visibility": "visible"
					});
					menu.animate({
						top: "50%"
					}, 600);
					animateDir = "";
					currentMenu = '.main-menu';
				}else if(animateDir === "bottom"){
					$("#"+submenu).animate({
						top: "-50%"
					});
					menu.css({
						"top": "150%",
						"left": "50%",
						"visibility": "visible"
					});
					menu.animate({
						top: "50%"
					}, 600);
					animateDir = "";
					currentMenu = '.main-menu';
				}else if(animateDir === "left"){
					$("#"+submenu).animate({
						left: "150%"
					});
					menu.css({
						"left": "-50%",
						"top": "50%",
						"visibility": "visible"
					});
					menu.animate({
						left: "50%"
					}, 600);
					animateDir = "";
					currentMenu = '.main-menu';
				}else if(animateDir === "right"){
					$("#"+submenu).animate({
						left: "-50%"
					});
					menu.css({
						"left": "150%",
						"top": "50%",
						"visibility": "visible"
					});
					menu.animate({
						left: "50%"
					}, 600);
					animateDir = "";
					currentMenu = '.main-menu';
				}
        
				$('.selected').removeClass('selected');
				$(currentMenu).first().addClass('selected');
			}
		}else{
			alert("The key with the key code of "+event.which+" cannot be used");
		}
	});
};
$(document).ready(main);
