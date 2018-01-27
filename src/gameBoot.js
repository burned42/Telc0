let gameBoot = function () {
};

gameBoot.prototype = {
    preload: function () {
        this.game.load.image('loading', 'assets/images/loading.png');
    },
    create: function () {
        this.game.state.start('preload');
    }
};