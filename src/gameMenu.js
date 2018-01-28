let gameMenu = function () {
    this.space = null;
};

gameMenu.prototype = {
    create: function () {
        this.game.add.image(this.game.width / 2 - 400, this.game.height / 2 - 300, 'startBg');
        let playButton = this.game.add.button(this.game.width / 2 - 128, this.game.height / 2 + 104, 'buttonPlay', this.playGame, this);
        playButton.anchor.setTo(0, 0);

        let creditsButton = this.game.add.button(this.game.width / 2 + 8, this.game.height / 2 + 104, 'buttonCredits');
        creditsButton.anchor.setTo(0, 0);
        creditsButton.onInputUp.add(this.toggleCredit, this);

        this.space = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

        this.background = this.game.add.graphics();
        this.background.beginFill(0x000000, 0.4);
        this.background.drawRect(this.game.width / 2 - 300, this.game.height / 2 - 300, 600, 400)
        this.background.visible = false;


        let credits = "Sounds from freesound.org:\n" +
            "Cash Register by kiddpark\nhttps://freesound.org/people/kiddpark/\n" +
            "\n" +
            "Sounds from soundbible.com:\n" +
            "Cha Ching Register Sound by Muska666\nhttp://soundbible.com/1997-Cha-Ching-Register.html\n" +
            "\n" +
            "Background Theme:\n" +
            "\"Pixelland\" by Kevin MacLeod\nhttps://incompetech.com\n" +
            "\n" +
            "License: Creative Commons: By Attribution 3.0\nhttp://creativecommons.org/licenses/by/3.0/";
        let creditStyle = {font: "bold 19px Arial", fill: "#edff70"};
        this.creditText = this.game.add.text(this.game.width / 2 - 285, this.game.height / 2 - 285, credits, creditStyle);
        this.creditText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);
        this.creditText.visible = false;
    },

    update: function () {
        if (this.space.isDown) {
            this.playGame();
        }
    },

    playGame: function () {
        this.game.state.start('telc0');
    },

    toggleCredit: function () {
        if (this.background.visible) {
            this.background.visible = false;
            this.creditText.visible = false;

        } else {
            this.background.visible = true;
            this.creditText.visible = true;
        }
    }

};
