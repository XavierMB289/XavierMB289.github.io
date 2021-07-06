//Game Variables
var unselected, selected, gatePipe, pipe;
var selW, selH;
var userSelect = 0, oldUS, userItem = null; //The keypress is handled based on what this is... userItem = [name, direction, oldCoords]
var level, currentLevel = 1;

function gameInit(){
	unselected = getImage("img/unselected_slot.png");
	selected = getImage("img/selected_slot.png");
	gatePipe = getImage("img/gate_pipe.png");
	pipe = getImage("img/pipe.png");
	
	selected.onload = function(){ //allows for download and play on desktop
		selW = selected.width;
		selH = selected.height;
	}
	
	getLevel("level/"+currentLevel+".json", loadGameLevel);
}
function loadGameLevel(obj){
	level = obj;
}
function gameUpdate(){
	
}
function slowGameUpdate(){
	
	if(level == null){
		return;
	}
	
	ctx.fillText(level.name, 20, 10);
	ctx.translate(canvasW/2-3*selW-3,canvasH-selH-10);
	for(let x = 0; x < 6; x+=1){
		if(x == userSelect){
			ctx.drawImage(selected, x*selW+x, 0);
		}else{
			ctx.drawImage(unselected, x*selW+x, 0);
		}
	}
	ctx.translate(-(canvasW/2-3*selW-3),-(canvasH-selH-10));
	
	ctx.translate(canvasW/2-6*selW-6,10);
	for(var i = 0; i < level.level.length; i++){
		var x = level.level[i][2]-1;
		var y = level.level[i][3]-1;
		var dirs = level.level[i][1];
		
		drawItem(level.level[i][0], x, y, dirs);
	}
	if(userSelect >= 6){
		var temp = userSelect - 6;
		var x = temp % 12;
		var y = Math.floor(temp/12);
		ctx.drawImage(selected, x*selW+x, y*selH+y);
		if(userItem != null){
			drawItem(userItem[0]. x, y, userItem[1]);
		}
	}
	ctx.translate(-(canvasW/2-6*selW-6),-10);
	
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
			default:
				console.log(letter);
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
			case "enter":
				userItem = getItem(level, userSelect);
				break;
			case "backspace":
				temp = userSelect;
				userSelect = oldUS;
				oldUS = temp;
				break;
			default:
				console.log(letter);
				break;
		}
	}
}
function drawItem(name, x, y, dirs){
	switch(name){ //Item name
		case "button":
			ctx.drawImage(getImage("img/button_off.png"), x*selW+x, y*selH+y);
			drawPipes(x, y, dirs);
			break;
		case "wire":
			drawPipes(x, y, dirs, false);
			break;
		case "battery":
			ctx.drawImage(getImage("img/battery_empty.png"), x*selW+x, y*selH+y);
			drawPipes(x, y, dirs);
			break;
	}
}
function drawPipes(x, y, dirs, gate = true){
	dirs = dirs.includes(",") ? dirs.split(",") : [dirs];
	for(var j = 0; j < dirs.length; j++){
		ctx.save();
		ctx.translate(x*selW+x+(selW/2), y*selH+y+(selH/2));
		switch(dirs[j]){
			case "s":
				ctx.rotate(Math.PI);
				break;
			case "e":
				ctx.rotate(0.5*Math.PI);
				break;
			case "w":
				ctx.rotate(1.5*Math.PI);
				break;
		}
		if(gate != false){
			ctx.drawImage(gatePipe, -selW/2, -selH/2);
		}else{
			ctx.drawImage(pipe, -selW/2, -selH/2);
		}
		ctx.restore();
	}
}