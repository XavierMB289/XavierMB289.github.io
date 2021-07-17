var nodes = [];

function addNode(startX, startY, selW, spd, img, path, callback = null){ // [[x,y], [x,y], [x,y], ...]
	var part = new ParticleNode(startX, startY, selW, spd, img, path);
	if(callback != null){
		part.addCallback(callback);
	}
	nodes.push(part);
}

function nodeCycle(){
	for(var i = 0; i < nodes.length; i++){
		nodes[i].paint();
		nodes[i].update();
	}
}

class ParticleNode{
	x = null;
	y = null;
	selW = null;
	speed = null;
	destination = 0;
	path = [];
	particles = [];
	partImage = null;
	spawnParticles = true;
	callback = null;
	
	constructor(startX, startY, selW, spd, img, path){ //startX and startY are gridbased...
		this.x = startX*selW;
		this.y = startY*selW;
		this.selW = selW;
		this.speed = spd;
		this.partImage = img;
		this.path = path;
		return this;
	}
	
	addCallback(callback){
		this.callback = callback;
	}
	
	paint(){
		for(var i = 0; i < this.particles.length; i++){
			var part = this.particles[i];
			part.paint(this.partImage, this.x, this.y);
		}
	}
	
	update(){
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
		var tempAngle = Math.atan2(this.path[this.destination][1]*this.selW - this.y, this.path[this.destination][0]*this.selW - this.x);
		this.x += Math.cos(tempAngle) * this.speed;
		this.y += Math.sin(tempAngle) * this.speed;
		
		if(Math.cos(tempAngle) < 0.2 && Math.sin(tempAngle) < 0.2){
			if(this.destination == this.path.length-1){
				if(this.particles.length == 0){
					if(this.callback != null){
						this.callback();
					}
					nodes.splice(this, 1);
				}
				this.spawnParticles = false;
			}else{
				this.destination++;
			}
		}
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