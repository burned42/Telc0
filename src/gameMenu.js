let gameMenu = function (game) {
};

gameMenu.prototype = {
    create: function () {
        this.game.add.button(this.game.width * 0.1, this.game.height * 0.6, 'play', this.playGame, this);
        // game title
        this.game.add.text(this.game.width * 0.1, this.game.height * 0.2, 'Telc0', {font: '42px Arial', fill: '#ffffff'});

        space = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    },
    update: function () {
        if (space.isDown) {
            this.playGame();
        }
    },
    playGame: function () {
        this.game.state.start('telc0');
    }
};