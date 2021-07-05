//Game Variables
var unselected, selected;
var userSelect = 0, oldUS; //The keypress is handled based on what this is...
var level, currentLevel = 1;

function gameInit(){
	unselected = getImage("img/unselected_slot.png");
	selected = getImage("img/selected_slot.png");
	
	getLevel("level/"+currentLevel+".json", loadGameLevel);
}
function loadGameLevel(obj){
	level = obj;
}
function gameUpdate(){
	
}
function slowGameUpdate(){
	
	var selW = selected.width;
	var selH = selected.height;
	
	if(level != null){
		ctx.fillText(level.name, 20, 10);
	}
	ctx.translate(canvasW/2-3*selW-3,canvasH-selH-10);
	for(let x = 0; x < 6; x+=1){
		if(x == userSelect){
			ctx.drawImage(selected, x*selW+x, 0);
		}else{
			ctx.drawImage(unselected, x*selW+x, 0);
		}
	}
	ctx.translate(-(canvasW/2-3*selW-3),-(canvasH-selH-10));
	
	if(userSelect >= 6){
		ctx.translate(canvasW/2-6*selW-6,10);
		var temp = userSelect - 6;
		var x = temp % 12;
		var y = Math.floor(temp/12);
		ctx.drawImage(selected, x*selW+x, y*selH+y);
		ctx.translate(-(canvasW/2-6*selW-6),-10);
	}
	
}
document.onkeyup = function(e){
	var letter = e.key.toLowerCase();
	if(userSelect < 6){ //if in the inventory
		switch(letter){
			case "a": //left
				userSelect -= userSelect - 1 > -1 ? 1 : 0;
				break;
			case "d": //right
				userSelect += userSelect + 1 < 6 ? 1 : 0;
				break;
			case "backspace": //change selection
				var temp = userSelect;
				userSelect = oldUS > 5 ? oldUS : 6;
				oldUS = temp;
				break;
		}
	}else{ //if on the board...
		var temp = userSelect - 6;
		switch(letter){
			case "w": //up
				userSelect -= temp - 12 > -1 ? 12 : 0;
				break;
			case "s":
				userSelect += temp + 12 < 96 ? 12 : 0;
				break;
			case "a":
				userSelect -= temp % 12 != 0 ? 1 : 0;
				break;
			case "d":
				userSelect += (temp + 1) % 12 != 0 ? 1 : 0; 
				break;
			case "backspace":
				temp = userSelect;
				userSelect = oldUS;
				oldUS = temp;
				break;
		}
	}
}
