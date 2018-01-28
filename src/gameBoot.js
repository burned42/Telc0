let gameBoot = function () {
};

gameBoot.prototype = {
    init: function () {
        this.game.stage.backgroundColor = '#C3EFB0';
    },
    preload: function () {
        this.game.load.image('loadingBar', 'assets/images/loading_bar.png');
        this.game.load.image('startBg', 'assets/images/startpage_telc0_background800x600.png');
    },

    create: function () {
        this.game.state.start('preload');
    }
};
