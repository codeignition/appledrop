class OnboardingScene extends Phaser.Scene {

    constructor() {
        super('OnboardingScene')
    }

    preload() {
        this.cameras.main.backgroundColor = Phaser.Display.Color.HexStringToColor("#697e96");
        this.load.image("onboarding", "assets/onboarding-4.png");
    }

    create() {
        this.bg = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'bg-menu')
        let scaleX = this.cameras.main.width / this.bg.width
        let scaleY = this.cameras.main.height / this.bg.height
        let scale = Math.max(scaleX, scaleY)

        this.bg.setScale(scale).setScrollFactor(0);
        this.bg.tint = Phaser.Display.Color.GetColor32(59, 59, 59, .1);


        var playerSprite = this.physics.add.sprite(0, 0, 'onboarding');
        playerSprite.setOrigin(0, 0);


        const playButton = this.add.text(game.config.width / 2 - (game.config.width / 20 + 80), game.config.height / 2 + 200, 'TAP HERE TO PLAY', {fontSize: game.config.width / 20});
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