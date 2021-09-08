var nodes = [];
var deleteNodes = [];

function addNode(startX, startY, selW, img, path, energizeStatus, callback = null){ // [[x,y], [x,y], [x,y], ...]
	var part = new ParticleNode(startX, startY, selW, img, path, energizeStatus);
	if(callback != null){
		part.addCallback(callback);
	}
	nodes.push(part);
}
function changeLastSpeed(spd){
	nodes[nodes.length-1].setSpeed(spd);
}

function nodeCycle(level){
	var tempLevel = level;
	if(deleteNodes.length > 0){
		deleteNodeByID(deleteNodes[0]);
		deleteNodes.splice(0, 1);
	}
	for(var i = 0; i < nodes.length; i++){
		nodes[i].paint();
		tempLevel = nodes[i].update(tempLevel);
	}
	return tempLevel;
}

function deleteNodeByID(ID){
	var node = null;
	for(var i = 0; i < nodes.length; i++){
		if(nodes[i].getID() == ID){
			node = i;
		}
	}
	if(node != null){
		nodes.splice(node, 1);
	}
}

class ParticleNode{
	ID = null;
	startX = null;
	startY = null;
	x = null;
	y = null;
	selW = null;
	speed = 6;
	destination = 0;
	path = [];
	energize = 0;
	particles = [];
	partImage = null;
	spawnParticles = true;
	callback = null;
	
	constructor(startX, startY, selW, img, path, energize = 0){ //startX and startY are gridbased...
		this.ID = Math.floor(Math.random() * 1000000000);
		this.x = startX*selW;
		this.y = startY*selW;
		this.startX = startX;
		this.startY = startY;
		this.selW = selW;
		this.partImage = img;
		this.path = path;
		this.energize = energize;
		return this;
	}
	
	addCallback(callback){
		this.callback = callback;
	}
	
	setSpeed(spd){
		this.speed = spd;
	}
	
	getID(){
		return this.ID;
	}
	
	paint(){
		for(var i = 0; i < this.particles.length; i++){
			var part = this.particles[i];
			part.paint(this.partImage, this.x, this.y);
		}
	}
	
	update(level){
		if(this.spawnParticles){
			this.particles.push(new Particle(this.x, this.y, this.speed));
		}
		
		for(var i = 0; i < this.particles.length; i++){
			var part = this.particles[i];
			part.update();
			if(part.life < 1){
				this.particles.splice(this.particles.indexOf(part), 1);
			}
		}
		var oldX = this.path[this.destination][0]*this.selW, oldY = this.path[this.destination][1]*this.selW;
		var tempAngle = Math.atan2(oldY - this.y, oldX - this.x);
		this.x += Math.cos(tempAngle) * this.speed;
		this.y += Math.sin(tempAngle) * this.speed;
		
		if(thresh(oldX, this.x, 3) && thresh(oldY, this.y, 3)){
			if(this.destination == this.path.length-1){
				if(this.particles.length == 0){
					var gridX = Math.floor(this.x/this.selW);
					var gridY = Math.floor(this.y/this.selW);
					if(getItem(level, gridX, gridY) != null){
						if(this.callback != null){
							this.callback();
						}
					}else{
						var inverseEnergy = this.energize*-1;
						var newImage = inverseEnergy==1?getImage("img/power.png"):getImage("img/powerless.png");
						var newPath = reverseArray(this.path);
						addNode(newPath[0][0], newPath[0][1], this.selW, newImage, newPath, inverseEnergy, function(){
							var temp = getItem(level, newPath[newPath.length-1][0]-0.5, newPath[newPath.length-1][1]-0.5);
							console.log(temp);
							if(temp[0] == "button"){
								level = alterItem(level, temp, buttonSwitch);
							}
						});
						changeLastSpeed(10);
					}
					deleteNodes.push(this.ID);
				}
				this.spawnParticles = false;
			}else{
				this.destination++;
			}
		}
		//finding the gridX and gridY
		if(this.energize == 1){
			var gridX = Math.floor(this.x/this.selW);
			var gridY = Math.floor(this.y/this.selW);
			return energize(level, gridX, gridY);
		}else if(this.energize == -1){
			var gridX = Math.floor(this.x/this.selW);
			var gridY = Math.floor(this.y/this.selW);
			return deenergize(level, gridX, gridY);
		}
		return level;
	}
}
class Particle{
	x = null;
	y = null;
	speed = null;
	rotate = null;
	life = Math.round(Math.random() * 10)+10;
	
	constructor(startX, startY, spd, rot = Math.random()*2*Math.PI){
		this.x = startX;
		this.y = startY;
		this.speed = spd;
		this.rotate = rot;
		return this;
	}
	
	paint(img, x, y){
		ctx.save();
		ctx.translate(this.x, this.y);
		ctx.rotate(Math.atan2(y - this.y, x - this.x)-90);
		ctx.drawImage(img, -img.width/2, -img.height/2);
		ctx.restore();
	}
	update(){
		this.life--;
		this.x += this.speed * Math.cos(this.rotate) * (this.life/10);
		this.y += this.speed * Math.sin(this.rotate) * (this.life/10);
	}
}