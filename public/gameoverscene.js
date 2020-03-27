class GameOverScene extends Phaser.Scene {

    constructor() {
        super('GameOverScene')
    }

    preload() {
        this.load.image("bg-gameover", "assets/china-bg-new.jpg");
    }


    create() {

        this.bg = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'bg-gameover')
        let scaleX = this.cameras.main.width / this.bg.width
        let scaleY = this.cameras.main.height / this.bg.height
        let scale = Math.max(scaleX, scaleY)

        this.bg.setScale(scale).setScrollFactor(0)
        this.bg.tint = Phaser.Display.Color.GetColor32(34, 34, 34, .9);

        let title = this.add.text(0, 0, "GAME OVER", {
            fontSize: game.config.width / 20
        });
        title.setPosition(game.config.width / 2 - (game.config.width / 20 + 100), game.config.height / 2);

        const playButton = this.add.text(game.config.width / 2 - (game.config.width / 20 + 100), game.config.height / 2 + 50, 'RETRY', {fontSize: game.config.width / 20});
        playButton.setInteractive();

        var self = this;

        playButton.on('pointerdown', () => {
            console.log(new Date().getTime() - self.previousTime > 10000);
            if (self.previousTime == null || new Date().getTime() - self.previousTime > 1000) {
                this.scene.stop();
                var theOtherScene = this.scene.get('PlayGame');
                theOtherScene.scene.restart();
                self.previousTime = new Date().getTime();
            }

        });

        const globalGameButtton = this.add.text(game.config.width / 2 - (game.config.width / 20 + 100), game.config.height / 2 + 100, 'ENTER GLOBAL GAME', {fontSize: game.config.width / 20});
        const newGameButtton = this.add.text(game.config.width / 2 - (game.config.width / 20 + 100), game.config.height / 2 + 150, 'CREATE A PERSONAL GAME', {fontSize: game.config.width / 20});
        const getYourFeedback = this.add.text(game.config.width / 2 - (game.config.width / 20 + 100), game.config.height / 2 + 200, 'SHARE YOUR FEEDBACK', {fontSize: game.config.width / 20});


        globalGameButtton.setInteractive();
        newGameButtton.setInteractive();
        getYourFeedback.setInteractive();

        newGameButtton.on('pointerdown', () => {
            window.location.href = '/'
        });

        globalGameButtton.on('pointerdown', () => {
            window.location.href = '../../game?game_name=global_game'
        });

        getYourFeedback.on('pointerdown', () => {
            window.location.href = 'https://forms.gle/pPSwrwnq5CtHwY1MA'
        });

    }

}