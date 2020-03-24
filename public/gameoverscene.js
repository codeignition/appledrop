
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

		const playButton = this.add.text(game.config.width/2 - (game.config.width / 20  + 100), game.config.height/2 + 50, 'RETRY', { fontSize: game.config.width / 20});
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

			const globalGameButtton = this.add.text(game.config.width/2 - (game.config.width / 20  + 100), game.config.height/2 + 100, 'ENTER GLOBAL GAME', { fontSize: game.config.width / 20});	
			const newGameButtton = this.add.text(game.config.width/2 - (game.config.width / 20  + 100), game.config.height/2 + 150, 'CREATE A PERSONAL GAME', { fontSize: game.config.width / 20});
			
			globalGameButtton.setInteractive();
			newGameButtton.setInteractive();

      newGameButtton.on('pointerdown', () => {
          window.location.href = '/'
			});
			
			globalGameButtton.on('pointerdown', () => {
				window.location.href = '../../game?game_name=global_game'
		});

	}

}