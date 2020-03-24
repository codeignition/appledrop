class OnboardingScene extends Phaser.Scene {

    constructor() {
        super('OnboardingScene')
    }

    preload() {
        this.cameras.main.backgroundColor = Phaser.Display.Color.HexStringToColor("#697e96");
        this.load.image("onboarding", "assets/onbaording-2-small.png");
    }

    create() {

        var playerSprite = this.physics.add.sprite(0, 0, 'onboarding');
        playerSprite.setOrigin(0, 0);


        const playButton = this.add.text(game.config.width / 2 - (game.config.width / 20 + 100), game.config.height / 2 + 100, 'TAP HERE TO PLAY', {fontSize: game.config.width / 20});
        playButton.setInteractive();

        var self = this;
        playButton.on('pointerdown', () => {
            console.log(new Date().getTime() - self.previousTime > 10000);
            if (self.previousTime == null || new Date().getTime() - self.previousTime > 10000) {

                this.scene.start('PlayGame');
                self.previousTime = new Date().getTime();
            }

        });


    }

}