let gamePreload = function () {
};

gamePreload.prototype = {
    preload: function () {
        let loadingBar = this.add.sprite((this.game.width - 512) / 2, 0, 'loading');
        loadingBar.anchor.setTo(0, 0);
        this.load.setPreloadSprite(loadingBar);

        this.game.load.spritesheet('bird', 'assets/images/bird_flying.png', 16, 16, 3);
        this.game.load.image('buttonCredits', 'assets/images/button_credits.png');
        this.game.load.image('buttonPlay', 'assets/images/button_play.png');
        this.game.load.image('buttonMenu', 'assets/images/button_menu.png');
        this.game.load.image('crossroads', 'assets/images/crossroads.png');
        this.game.load.image('green', 'assets/images/green.png');
        this.game.load.image('greenGrass', 'assets/images/green_grass.png');
        this.game.load.image('greenGrassRabbit', 'assets/images/green_grass_rabbit.png');
        this.game.load.image('greenGrassRabbitMoving', 'assets/images/tilemap_rabbit.png');
        this.game.load.image('houseBig', 'assets/images/house_big.png');
        this.game.load.image('houseSmall', 'assets/images/house_small.png');
        this.game.load.image('lake', 'assets/images/lake.png');
        this.game.load.image('lakeWithDuck', 'assets/images/lake_with_duck.png');
        this.game.load.image('lakeWithDuckSmall', 'assets/images/lake_with_duck_small.png');
        this.game.load.image('streetHorizontal', 'assets/images/street_horizontal.png');
        this.game.load.image('streetVertical', 'assets/images/street_vertical.png');
        this.game.load.image('telc0Logo', 'assets/images/telc0_logo.png');
        this.game.load.image('tiles', 'assets/images/tilemap.png');
        this.game.load.image('tower', 'assets/images/tower.png');
        this.game.load.image('startBg', 'assets/images/startpage_telc0_background800x600.png');

        this.game.load.audio('cashBad', 'assets/sounds/cashbad.mp3');
        this.game.load.audio('cashGood', 'assets/sounds/cashgood.mp3');
        this.game.load.audio('backgroundTheme', 'assets/sounds/pixelland.mp3');

    },

    create: function () {
        this.game.state.start('menu');
    }
};
