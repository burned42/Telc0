var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });

function preload() {
    game.load.image('house_small', 'assets/images/house_small.png');
    game.load.image('lake', 'assets/images/lake.png');
}

function create() {
    var map = new Map(32, 32, 120);
    game.map = map;
    house = game.make.sprite(0, 0, 'house_small');
    lake = game.make.sprite(0, 0, 'lake');
    house.anchor.set(0.5);
    lake.anchor.set(0.5);
    lake.scale.setTo(0.5, 0.5);
    house.scale.setTo(0.5, 0.5);
    //	This is the BitmapData we're going to be drawing to
    game.bmd = game.add.bitmapData(game.width, game.height);
    game.bmd.addToWorld();

    //	Disables anti-aliasing when we draw sprites to the BitmapData
    game.bmd.smoothed = false;
}

function update() {
}

function renderMap() {
    game.bmd.clear();
    for (let i = 0; i < game.map.width; i++){
        for (let j =0; j < game.map.height; j++){
            if (game.map.getMap()[i][j] === 'H'){
                game.bmd.draw(house, i * house.width, j * house.height);
            }
            else {
                game.bmd.draw(lake, i * lake.width, j * lake.height);
            }
        }
    }
}
