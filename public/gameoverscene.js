
class GameOverScene extends Phaser.Scene{
	
	constructor(){
		super('GameOverScene')
	}

	preload(){

	}


	create(){
		this.cameras.main.backgroundColor = Phaser.Display.Color.HexStringToColor("#697e96");
		let title = this.add.text(0, 0, "GAME OVER", {
            fontSize: game.config.width / 20
		});
		title.setPosition(game.config.width/2 - (game.config.width / 20 + 100), game.config.height/2);

		const playButton = this.add.text(game.config.width/2 - (game.config.width / 20  + 100), game.config.height/2 + 50, 'PLAY AGAIN', { fontSize: game.config.width / 20});
	    playButton.setInteractive();
	    
	    var self = this;
	    playButton.on('pointerdown', () => { 
	    	console.log(new Date().getTime() - self.previousTime > 10000);
	    	if(self.previousTime == null || new Date().getTime() - self.previousTime > 1000) {
				this.scene.stop();
				var theOtherScene = this.scene.get('PlayGame');
		    	theOtherScene.scene.restart();
		    	self.previousTime = new Date().getTime();
	        }

	    });

	}

}