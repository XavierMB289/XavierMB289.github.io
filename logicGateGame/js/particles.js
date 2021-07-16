var nodes = [];

function addNode(startX, startY, spd, img, path){ // [[x,y], [x,y], [x,y], ...]
	nodes.push(new ParticleNode(startX, startY, spd, img, path));
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
	speed = null;
	destination = 0;
	path = [];
	particles = [];
	partImage = null;
	
	constructor(startX, startY, spd, img, path){ 
		this.x = startX;
		this.y = startY;
		this.speed = spd;
		this.partImage = img;
		this.path = path;
	}
	
	paint(){
		for(var i = 0; i < this.particles.length; i++){
			var part = this.particles[i];
			part.paint(this.partImage, this.x, this.y);
		}
	}
	
	update(){
		this.particles.push(new Particle(this.x, this.y, this.speed));
		
		for(var i = 0; i < this.particles.length; i++){
			var part = this.particles[i];
			part.update();
			if(part.life < 1){
				this.particles.splice(this.particles.indexOf(part), 1);
			}
		}
		var tempAngle = Math.atan2(this.path[this.destination][1] - this.y, this.path[this.destination][0] - this.x);
		this.x += Math.cos(tempAngle) * this.speed;
		this.y += Math.sin(tempAngle) * this.speed;
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