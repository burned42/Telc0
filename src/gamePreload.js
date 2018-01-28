let gamePreload = function () {
};

gamePreload.prototype = {
    preload: function () {
        this.game.add.image(this.game.width / 2 - 400, this.game.height / 2 - 300, 'startBg');
        let loadingBar = this.add.sprite((this.game.width - 256) / 2, this.game.height / 2 + 104 + 96, 'loadingBar');
        loadingBar.anchor.setTo(0, 0);
        this.load.setPreloadSprite(loadingBar);

        this.game.load.spritesheet('bird', 'assets/images/bird_flying.png', 16, 16, 3);
        this.game.load.image('buttonCredits', 'assets/images/button_credits.png');
        this.game.load.image('buttonPlay', 'assets/images/button_play.png');
        this.game.load.image('buttonMenu', 'assets/images/button_menu.png');
        this.game.load.spritesheet('greenGrassRabbitMoving', 'assets/images/tilemap_rabbit.png', 128, 128, 4);
        this.game.load.spritesheet('swimmingDuck', 'assets/images/tilemap_duck.png', 128, 128, 9);
        this.game.load.image('tiles', 'assets/images/tilemap.png');
        this.game.load.image('stars', 'assets/images/stars.png');

        this.game.load.audio('cashBad', 'assets/sounds/cashbad.mp3');
        this.game.load.audio('cashGood', 'assets/sounds/cashgood.mp3');
        this.game.load.audio('backgroundTheme', 'assets/sounds/pixelland.mp3');

    },

    create: function () {
        this.game.state.start('menu');
    }
};
