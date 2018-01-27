let gameBoot = function (game) {
};

gameBoot.prototype = {
    preload: function () {
        // need loading image
        this.game.load.image('loading', 'assets/images/loading.png');
    },
    create: function () {
        this.game.state.start('preload');
    }
};