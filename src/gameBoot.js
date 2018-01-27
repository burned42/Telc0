let gameBoot = function (game) {
};

gameBoot.prototype = {
    preload: function () {
        this.game.load.image("loading", "assets/loading.png");
    },
    create: function () {
        this.game.state.start("Preload");
    }
};