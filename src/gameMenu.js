let gameMenu = function (game) {
};

gameMenu.prototype = {
    create: function () {
        let logo = this.game.add.image(this.game.width /2, 32, 'telc0Logo');
        logo.anchor.setTo(0.5, 0);
        let button1 = this.game.add.button(this.game.width / 2 - 128, 304, 'buttonPlay', this.playGame, this);
        button1.anchor.setTo(0, 0);
        let button2 = this.game.add.button(this.game.width / 2 + 128, 304, 'buttonCredits', this.showCredits, this);
        button2.anchor.setTo(0, 0);

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