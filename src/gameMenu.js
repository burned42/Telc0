let gameMenu = function (game) {
};

gameMenu.prototype = {
    create: function () {
        this.game.add.button((this.game.width - 64) / 2, 200, 'play', this.playGame, this);
        this.game.add.text((this.game.width - 100) / 2, 100, 'Telc0', {font: '42px Arial', fill: '#ffffff'});
        this.game.add.text((this.game.width - 150) / 2, 300, 'Credits', {font: '42px Arial', fill: '#ffffff'});
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