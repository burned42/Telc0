let gamePreload = function (game) {
};

gamePreload.prototype = {
    preload: function () {
        let loadingBar = this.add.sprite(160, 240, 'loading');
        loadingBar.anchor.setTo(0.5, 0.5);
        this.load.setPreloadSprite(loadingBar);

        this.game.load.image('crossroads', 'assets/images/crossroads.png');
        this.game.load.image('green', 'assets/images/green.png');
        this.game.load.image('greenGrass', 'assets/images/green_grass.png');
        this.game.load.image('greenGrassRabbit', 'assets/images/green_grass_rabbit.png');
        this.game.load.image('houseBig', 'assets/images/house_big.png');
        this.game.load.image('houseSmall', 'assets/images/house_small.png');
        this.game.load.image('lake', 'assets/images/lake.png');
        this.game.load.image('lakeWithDuck', 'assets/images/lake_with_duck.png');
        this.game.load.image('streetHorizontal', 'assets/images/street_horizontal.png');
        this.game.load.image('streetVertical', 'assets/images/street_vertical.png');
        this.game.load.image('tower', 'assets/images/tower.png');

        this.game.load.audio('cashBad', 'assets/sounds/cashbad.mp3');
        this.game.load.audio('cashGood', 'assets/sounds/cashgood.mp3');
    },
    create: function () {
        this.game.state.start('menu');
    }
};