class MenuScene extends Phaser.Scene{
	
	constructor(){
		super('MenuScene')
		self.previousTime = null;
	}

	preload(){

	}

	create(){
		this.cameras.main.backgroundColor = Phaser.Display.Color.HexStringToColor("#697e96");
		
		var name = '';
		
		if(localStorage.getItem('name') === null ) {
			name = prompt("Please enter your name to continue")
			if(name === null){
				window.location.reload();
				return
			}
			else{
				localStorage.setItem('name', name);
			}
	  }
	  else {
			name = localStorage.getItem('name');
		}

		var helloText = 'Hello ' + name + ''; 
		
		this.add.text(game.config.width/2 - (game.config.width / 20  + 100), game.config.height/2 - 50, helloText, { fontSize: game.config.width / 20});
	 	
	 	const playButton = this.add.text(game.config.width/2 - (game.config.width / 20  + 100), game.config.height/2, 'CLICK HERE TO PLAY', { fontSize: game.config.width / 20});
	    playButton.setInteractive();
	    
	    var self = this;
	    playButton.on('pointerdown', () => { 
	    	console.log(new Date().getTime() - self.previousTime > 10000);
	    	if(self.previousTime == null || new Date().getTime() - self.previousTime > 10000) {
		
		    	this.scene.start('PlayGame');
		    	self.previousTime = new Date().getTime();
	        }

	    });

	 	const howToPlay = this.add.text(game.config.width/2 - (game.config.width / 20  + 100), game.config.height/2 + 50, 'HOW TO PLAY?', { fontSize: game.config.width / 20});
	    howToPlay.setInteractive();
	    
	    var self = this;
	    howToPlay.on('pointerdown', () => { 
		    	this.scene.start('OnboardingScene');
	    });
	}

}
