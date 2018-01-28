let gameOver = function () {
    this.space = null;
};

gameOver.prototype = {
    create: function () {
        this.game.add.image(this.game.width / 2 - 400, this.game.height / 2 - 300, 'startBg');

        let endGame = this.game.add.emitter(this.game.world.centerX, this.world.centerY, 10);
        endGame.makeParticles('stars');
        endGame.setAlpha(1, 0, 5000);
        endGame.setRotation(0, 0);
        endGame.setScale(0.3, 1, 0.3, 1, 4000, Phaser.Easing.Quartic.Out);
        endGame.gravity = -100;
        endGame.start(false, 3000, 10);
        endGame.emitX = this.game.width * 0.5;
        endGame.emitY = this.game.height * 0.5;
        this.game.add.tween(endGame).to({emitX: 800 - 64}, 1000, Phaser.Easing.Sinusoidal.InOut, true, 0, Number.MAX_VALUE, true);
        this.game.add.tween(endGame).to({emitY: 200}, 4000, Phaser.Easing.Sinusoidal.InOut, true, 0, Number.MAX_VALUE, true);

        let gameOverLabel = this.game.add.text(this.game.width / 2, this.game.height / 2 - 232, 'Game Over', {
            font: '48px Arial',
            fill: '#909296'
        });
        gameOverLabel.anchor.setTo(0.5, 0);
        let scoreLable = this.game.add.text(this.game.width / 2, this.game.height / 2 + 96, 'Score: ' + score + '%', {
            font: '32px Arial',
            fill: '#909296'
        });
        scoreLable.anchor.setTo(0.5, 0);
        let buttonMenuPos = this.game.add.button(this.game.width / 2, this.game.height / 2 + 144, 'buttonMenu', this.playGame, this);
        buttonMenuPos.anchor.setTo(0.5, 0);

        this.space = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    },

    update: function () {
        if (this.space.isDown) {
            this.playGame();
        }
    },

    playGame: function () {
        this.game.state.start('menu');
    }
};
