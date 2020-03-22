class MenuScene extends Phaser.Scene{
	
	constructor(){
		super('MenuScene')
		self.previousTime = null;
	}

	preload(){
		this.load.image("bg", "assets/storm-bg-2.jpg");
	}

	create(){
 	this.bg = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'bg')
    let scaleX = this.cameras.main.width / this.bg.width
    let scaleY = this.cameras.main.height / this.bg.height
    let scale = Math.max(scaleX, scaleY)
    
    this.bg.setScale(scale).setScrollFactor(0)
        this.bg.tint = Phaser.Display.Color.GetColor32(34, 34, 34, .9);

		var name = '';
		
		if(localStorage.getItem('playerName') === null ) {
			name = prompt("Please enter your name to continue")
			if(name === null){
				window.location.reload();
				return
			}
			else{
				localStorage.setItem('playerName', name);
			}
	  }


	 	const playButton = this.add.text(game.config.width/2 - (game.config.width / 20  + 100), game.config.height/2, 'TAP HERE TO PLAY', { fontSize: game.config.width / 20});
	    playButton.setInteractive();
	    
	    var self = this;
	    playButton.on('pointerdown', () => { 
	    	console.log(new Date().getTime() - self.previousTime > 10000);
	    	if(self.previousTime == null || new Date().getTime() - self.previousTime > 10000) {
		
		    	this.scene.start('PlayGame');
		    	self.previousTime = new Date().getTime();
	        }

	    });

	 	const howToPlay = this.add.text(game.config.width/2 - (game.config.width / 20  + 100), game.config.height/2 + 50, 'LEARN HOW TO PLAY?', { fontSize: game.config.width / 20});
	    howToPlay.setInteractive();
	    
	    var self = this;
	    howToPlay.on('pointerdown', () => { 
		    	this.scene.start('OnboardingScene');
	    });
	}

	update(time) {

		
	}
}
