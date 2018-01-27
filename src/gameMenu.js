let gameMenu = function (game) {
};

gameMenu.prototype = {
    create: function () {
        this.game.add.button(20, 200, 'play', this.playGame, this);
        // game title
        this.game.add.text(20, 100, 'Telc0', {font: '42px Arial', fill: '#ffffff'});

        space = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
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