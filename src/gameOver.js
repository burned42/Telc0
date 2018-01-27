let gameOver = function () {
    this.space = null;
};

gameOver.prototype = {
    create: function() {
        let endGame = this.game.add.emitter(this.game.world.centerX, this.world.centerY, 10);
        endGame.makeParticles('$$$');
        endGame.setAlpha(1, 0, 5000);
        endGame.setRotation(0, 0);
        endGame.setScale(0.3, 1, 0.3, 1, 4000, Phaser.Easing.Quartic.Out);
        endGame.gravity = -100;
        endGame.start(false, 3000, 10);
        endGame.emitX = this.game.width * 0.5;
        endGame.emitY = this.game.height * 0.5;
        this.game.add.tween(endGame).to( { emitX: 800-64 }, 1000, Phaser.Easing.Sinusoidal.InOut, true, 0, Number.MAX_VALUE, true);
        this.game.add.tween(endGame).to( { emitY: 200 }, 4000, Phaser.Easing.Sinusoidal.InOut, true, 0, Number.MAX_VALUE, true);

        this.game.add.text(this.game.width * 0.2, 100, 'Game Over', {font: '42px Arial', fill: '#ffffff'});
        let score = 100 / this.game.map.houses.length * countCoveredHouses;
        this.game.add.text(this.game.width * 0.2, 200, 'Score: ' + score + '%', {font: '32px Arial', fill: '#ffffff'});
        //replace this with menu button
        this.game.add.button(this.game.width * 0.1, this.game.height * 0.6, 'buttonMenu', this.playGame, this);

        this.space = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    },

    update: function () {
        if (this.space.isDown) {
            this.playGame();
        }
    },

    playGame: function () {
        this.game.state.start('preload');
    }
};
