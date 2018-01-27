let gameMenu = function () {
    this.space = null;
};

gameMenu.prototype = {
    create: function () {
        let logo = this.game.add.image(this.game.width /2, 32, 'telc0Logo');
        logo.anchor.setTo(0.5, 0);
        let button1 = this.game.add.button(this.game.width / 2 - 128, 304, 'buttonPlay', this.playGame, this);
        button1.anchor.setTo(0, 0);
        let button2 = this.game.add.button(this.game.width / 2 + 8, 304, 'buttonCredits', function () {
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