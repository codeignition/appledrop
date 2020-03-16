
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

	}

}