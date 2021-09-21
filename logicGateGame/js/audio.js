var bgm = null;
var players = [];

function initAudio(){
	bgm = [
		"bgm/blue_lantern_yi_nantiro.mp3",
		"bgm/guru_meditation_bitwrath.mp3",
		"bgm/hummingbird_yi_nantiro.mp3"
	];
}

function createPlayer(track, volume=0.3){
	var temp = new Player(track,volume);
	if(temp.hasEnded() != true){
		players.push();
	}
}

function updateAudio(){
	
}

class Player{
	audio = null;
	
	constructor(track, volume){
		this.audio = document.createElement("audio");
		if(this.audio.canPlayType("audio/mpeg") != true){
			this.audio = null;
		}else{
			this.audio.setAttribute("src","audio/"+track);
			this.audio.volume=volume;
			this.audio.play();
		}
	}
	
	hasEnded(){
		return audio == null ? true : audio.ended;
	}
	
}