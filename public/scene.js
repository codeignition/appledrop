var lastFired = 0;


function random(min, max) {
    return Math.random() * (max - min + 1) + min;
}


class playGame extends Phaser.Scene {

    constructor() {
        super("PlayGame");
        console.log("constructor");
    }

    preload() {

        console.log("preload");

        this.enemies = [];

        this.playersSprite = {};
        this.playerPreviousLocation = null
        this.score = 0;


        this.load.image("bird", "assets/ghost-small.png");

        this.load.image('pin', "../assets/cross-small.png");
        this.load.image('mountains-back', "../assets/fenc-small.png");
        this.load.atlas('flares', 'assets/flares.png', 'assets/flares.json');


        this.cursorKeys = this.input.keyboard.createCursorKeys();
        this.cameras.main.backgroundColor = Phaser.Display.Color.HexStringToColor("#697e96");
        this.load.audio('backgroundSound', 'assets/bg-music.mp3', {
            instances: 1
        });

        this.load.audio('jump', ['assets/flamestrike.mp3', 'assets/flamestrike.wav'], {
            instances: 1
        });

        this.score = 0;
        this.thunderActive  = false;

        this.lightning = [];
        this.lightTimeCurrent = 0;
        this.lightTimeTotal = 0;
        this.showLightning = false;
        this.lastThunderTime = new Date().getTime();


    }

    create() {


        this.bg = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'bg')
        let scaleX = this.cameras.main.width / this.bg.width
        let scaleY = this.cameras.main.height / this.bg.height
        let scale = Math.max(scaleX, scaleY)

        this.bg.setScale(scale).setScrollFactor(0)
        this.bg.tint = Phaser.Display.Color.GetColor32(34, 34, 34, .9);

        var music = this.sound.add('backgroundSound');
        this.jumpSound = this.sound.add('jump');

        music.setLoop(true)

        music.play()

        var self = this;
        this.mountainsBack = this.add.tileSprite(0, game.config.height + 150, 5000, 500, 'mountains-back');


        this.socket = io()


        this.socket.on('currentPlayers', function (players) {
            Object.keys(players).forEach(function (id) {

                var player = players[id];
                if (player.playerId in self.playersSprite) {
                    self.playersSprite[player.playerId].x = player.x;
                    self.playersSprite[player.playerId].y = player.y;
                } else {
                    if (player.playerId === self.socket.id) {
                        self.plotSelf(player);
                    } else {
                        self.plotOther(player);
                    }
                }


            });

            self.physics.add.overlap(self.enemies, self.playersSprite[self.socket.id], self.stopTheGame, null, self);


        });


        this.socket.on('playerMoved', function (player) {
            if (player.playerId in self.playersSprite) {
                self.playersSprite[player.playerId].x = player.x;
                self.playersSprite[player.playerId].y = player.y;

            } else {
                console.log(player)
                console.log("not found^")
            }
        });

        this.socket.on('playerRemoved', function (playerId) {
            if (playerId in self.playersSprite) {
                var playerSprite = self.playersSprite[playerId];
                playerSprite.destroy();
                delete self.playersSprite[playerId];
            } else {
                console.log(player)
                console.log("not found^")
            }
        });

        this.socket.on('newPlayer', function (player) {
            if (player.playerId in self.playersSprite) {
                self.playersSprite[player.playerId].x = player.x;
                self.playersSprite[player.playerId].y = player.y;
            } else {
                self.plotOther(player);
            }

        });


        this.socket.on('enemyMoved', function (enemy) {
        });

        this.socket.on('enemyCreated', function (enemy) {
            console.log(enemy);
            self.addEnemy(enemy)

            self.physics.add.overlap(self.enemies, self.playersSprite[self.socket.id], self.stopTheGame, null, self);

        });

        this.socket.on('gameOver', function () {
            self.stopTheGame(null, null)
        });

        this.socket.on('scoreUpdate', function (data) {
            var container = self.playersSprite[data.playerId];
            var score = container.getAt(1);
            score.setText("Score: " + data.score);
        });

        this.physics.world.on('worldbounds', this.onWorldBounds, this)




    }

    onWorldBounds(data) {
        if (data.gameObject.body.blocked.down) {
            this.stopTheGame(null, null);
        }
    }

    stopTheGame(enemies, bird) {
        this.cameras.main.shake(500);

        this.cameras.main.fade(250);
        this.time.delayedCall(250, function () {
            this.socket.disconnect();
            this.scene.start('GameOverScene')
            this.scene.stop('PlayGame')
        }, [], this);


    }


    update(time) {
        var playerSprite = this.playersSprite[this.socket.id];

        if (this.socket != null && playerSprite != null) {
            if (this.cursorKeys.space.isDown || this.input.activePointer.isDown) {
                if (this.sound.context.state === 'suspended') {
                    this.sound.context.resume();
                }
                this.jumpSound.play();
                playerSprite.body.setVelocity(0, -200)
            }

            if (this.playerPreviousLocation != null && (playerSprite.x != this.playerPreviousLocation.x || playerSprite.y != this.playerPreviousLocation.y))
                this.socket.emit('movementChanged', {x: playerSprite.x, y: playerSprite.y, playerId: this.socket.id})

            this.playerPreviousLocation = {x: playerSprite.x, y: playerSprite.y,}
        }
        var self = this;
        Object.keys(this.enemies).forEach(function (id) {
            var enemy = self.enemies[id];
            if (enemy.x <= 0 && enemy.x >= -10) {
                self.score += 1;
                var container = self.playersSprite[self.socket.id];
                var score = container.getAt(1);

                score.setText("Score: " + self.score);
                self.socket.emit('scoreUpdate', {score: self.score, playerId: self.socket.id})
                delete self.enemies[id];

            }


        });


        this.mountainsBack.tilePositionX += 5;
        var thunderProb = Math.random() > .995;

        if (thunderProb === false && this.lastThunderTime != null && ((time - this.lastThunderTime) >= 200)) {
            this.bg.tint = Phaser.Display.Color.GetColor32(59, 59, 59, .5);
            this.thunderActive  =  false;
        } else {
            this.bg.tint = 0xffffff;
            if(this.thunderActive === false) {
                this.lastThunderTime = time;
                this.thunderActive  =  true;
            }
        }

        if(this.showLightning === true) {
            this.animateLightning();
        }else if(thunderProb === true && this.showLightning === false) {
            this.showLightning = true;
        }


    }

     animateLightning() {

        this.lightTimeCurrent++;
        if (this.lightTimeCurrent >= this.lightTimeTotal) {

            this.showLightning = false;

            if(this.graphic !== null && this.graphic !== undefined)
                this.graphic.clear();

            this.graphic = this.add.graphics();
            this.graphic.lineStyle(2, 0xffffff, random(10, 30)/100);


            this.createLightning();
            this.lightTimeCurrent = 0;
            this.lightTimeTotal = random(25, 50)

        }
        if(this.showLightning === true)
            this.drawLightning();

    }

    createLightning() {
        var w = this.cameras.main.width;
        var h = this.cameras.main.height;


        var x = random(0, w);
        var y = random(0, 10);

        var createCount = random(1, 4);
        for (var i = 0; i < createCount; i++) {
            var single = {
                x: x,
                y: y,
                xRange: random(20, 10),
                yRange: random(10, 20),
                path: [{
                    x: x,
                    y: y
                }],
                pathLimit: random(20, 30)
            };
            this.lightning.push(single);
        }
    }

    drawLightning() {
        for (var i = 0; i < this.lightning.length; i++) {
            var light = this.lightning[i];

            light.path.push({
                x: light.path[light.path.length - 1].x + (random(0, light.xRange) - (light.xRange / 2)),
                y: light.path[light.path.length - 1].y + (random(0, light.yRange))
            });

            if (light.path.length > light.pathLimit) {
                this.lightning.splice(i, 1);
            }


            this.graphic.beginPath();
            this.graphic.moveTo(light.x, light.y);


            for (var pc = 0; pc < light.path.length; pc++) {
                this.graphic.lineTo(light.path[pc].x, light.path[pc].y);
            }
            this.graphic.stroke();
        }
    };


    plotSelf(player) {
        var container = this.add.container(0, 0);
        container.setExclusive(true);

        this.physics.world.enable(container);

        var playerSprite = this.physics.add.sprite(0, 0, 'bird');
        playerSprite.setOrigin(0, 0);

        container.body.setGravity(0, 500);
        container.body.collideWorldBounds = true;
        container.body.onWorldBounds = true
        container.body.bounce.set(.3);

        var score = this.add.text(0, -20, "Score: 0", {font: "16px Arial", fill: "#ffffff"});

        container.add([playerSprite, score]);
        container.setDepth(100);
        this.playersSprite[player.playerId] = container;
    }

    plotOther(player) {
        var container = this.add.container(0, 0);
        container.setExclusive(true);

        this.physics.world.enable(container);

        var playerSprite = this.physics.add.sprite(0, 0, 'bird');
        playerSprite.setOrigin(0, 0);
        container.body.x = player.x;
        container.body.y = player.y;
        playerSprite.alpha = .1;

        var score = this.add.text(0, -20, "", {font: "16px Arial", fill: "#000000"});

        container.add([playerSprite, score]);
        container.setDepth(100);

        this.playersSprite[player.playerId] = container;
    }

    addEnemy(enemy) {
        var pin = this.physics.add.sprite(enemy.x, enemy.y, 'pin');

        pin.setVelocity(-100, 10);
        pin.setDepth(100);

        this.enemies.push(pin);
    }
}




