var bgm = null;
var bgmTimer = 50; //Audio wont play unless the user interacts first...
var players = [];
var playerDelete = [];
var muted = false;

function initAudio(){
	bgm = [
		"bgm/blue_lantern_yi_nantiro.mp3",
		"bgm/guru_meditation_bitwrath.mp3",
		"bgm/hummingbird_yi_nantiro.mp3"
	];
}

function createPlayer(track, volume=0.1){
	if(!muted){
		var temp = new Player(track,volume);
		if(temp.hasEnded() != true){
			players.push(temp);
		}
	}
}

function updateAudio(){
	if(!muted){
		if(playerDelete.length > 0){
			deleteAudioByID(playerDelete[0]);
			playerDelete.splice(0, 1);
		}
		for(var i = 0; i < players.length; i++){
			if(players[i].hasEnded() != false){
				playerDelete.push(players[i].getID());
			}
		}
		if(bgmTimer-- <= 0){
			if(players.length <= 0){
				createPlayer(bgm[Math.round(Math.random() * 99)%3]);
				bgmTimer = 300;
			}
		}
	}else{
		for(var i = 0; i < players.length; i++){
			players[i].stop();
		}
		players = [];
	}
}

function deleteAudioByID(id){
	var audio = null;
	for(var i = 0; i < players.length; i++){
		if(players[i].checkID(id)){
			audio = i;
		}
	}
	if(audio != null){
		players.splice(audio, 1);
	}
}

class Player{
	ID = null;
	audio = null;
	
	constructor(track, volume){
		this.ID = Math.floor(Math.random() * 1000000000);
		this.audio = document.createElement("audio");
		if(this.audio.canPlayType("audio/mpeg") == ""){
			this.audio = null;
			console.log("UNABLE TO PLAY AUDIO");
		}else{
			this.audio.setAttribute("src","audio/"+track);
			this.audio.volume=volume;
			this.audio.play();
		}
	}
	
	checkID(id){
		return this.ID == id;
	}
	
	getID(){
		return this.ID;
	}
	
	hasEnded(){
		return this.audio == null ? true : this.audio.ended;
	}
	
	stop(){
		this.audio.pause();
	}
	
}