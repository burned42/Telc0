let gameBoot = function () {
};

gameBoot.prototype = {
    preload: function () {
        this.game.load.image('loading', 'assets/images/loading.png');
        this.game.load.image('startBg', 'assets/images/startpage_telc0_background800x600.png');
    },

    create: function () {
        this.game.state.start('preload');
    }
};
