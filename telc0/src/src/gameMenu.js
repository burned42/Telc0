let gameMenu = function () {
    this.space = null;
};

gameMenu.prototype = {
    create: function () {
        this.game.add.image(this.game.width / 2 - 400, this.game.height / 2 - 300, 'startBg');
        let playButton = this.game.add.button(this.game.width / 2 - 128, this.game.height / 2 + 104, 'buttonPlay', this.playGame, this);
        playButton.anchor.setTo(0, 0);
        let creditButton = this.game.add.button(this.game.width / 2 + 8, this.game.height / 2 + 104, 'buttonCredits', function () {
            if (document.getElementById("game").style.display !== "none") {
                document.getElementById("game").style.display = "none";
                document.getElementById("credits").style.display = "block";
            } else {
                document.getElementById("game").style.display = "block";
                document.getElementById("credits").style.display = "none";
            }
        });
        creditButton.anchor.setTo(0, 0);

        this.space = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    },

    update: function () {
        if (this.space.isDown) {
            this.playGame();
        }
    },

    playGame: function () {
        this.game.state.start('telc0');
    },
};
