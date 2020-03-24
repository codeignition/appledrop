const config = {
    type: Phaser.AUTO,
    parent: "phaser",
    width: 360,
    height: 640,
    scene: [MenuScene, playGame, GameOverScene, OnboardingScene],
    physics:
        {
            default: 'arcade',
            arcade: {debug: false}
        }
};

const game = new Phaser.Game(config);
