let gameMenu = function (game) {
    this.space = null;
};

gameMenu.prototype = {
    create: function () {
        this.game.add.button((this.game.width - 64) / 2, 200, 'play', this.playGame, this);
        this.game.add.image((this.game.width - 128) / 2, 30, 'telc0Logo');
        let creditsText = this.game.add.text(this.game.width / 2, 300, 'Credits', {font: '42px Arial', fill: '#ffffff'});
        creditsText.anchor.setTo(0.5, 0);
        this.space = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    },
    update: function () {
        if (this.space.isDown) {
            this.playGame();
        }
    },
    playGame: function () {
        this.game.state.start('telc0');
    }
};