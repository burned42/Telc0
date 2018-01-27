let gameMenu = function () {
    this.space = null;
};

gameMenu.prototype = {
    create: function () {
        let logo = this.game.add.image(0, 0, 'startBg');
        let button1 = this.game.add.button(this.game.width / 2 - 128, 404, 'buttonPlay', this.playGame, this);
        button1.anchor.setTo(0, 0);
        let button2 = this.game.add.button(this.game.width / 2 + 8, 404, 'buttonCredits', function () {
            if (document.getElementById("game").style.display !== "none") {
                document.getElementById("game").style.display = "none";
                document.getElementById("credits").style.display = "block";
            }
        });
        button2.anchor.setTo(0, 0);

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
