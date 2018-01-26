var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });

var moneytext;
var lastrent;
var timenow;

// TODO change values
var money = 2000;
var towercost = -1000;
var revenue = 50 * 22;
var maintenanceinterval = 10 * 1000;
var maintenancecost = -100;


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
    moneytext = game.add.text(30, 30, "$ " + money, { font: "17px Arial", fill: "#edff70"});
    lastrent = game.time.now;
}

function update() {
    timenow = game.time.now;
    if (timenow - lastrent > maintenanceinterval) {
        lastrent = game.time.now;
        update_money(maintenancecost)
    }
    if (money < towercost) {
        // TODO End the game
    }
    game.input.onDown.addOnce(build_tower, this);
    renderMap();
}

function renderMap() {
    game.bmd.clear();
    for (let i = 0; i < game.map.width; i++){
        for (let j =0; j < game.map.height; j++){
            let cell = game.map.getMap()[i][j];
            if (cell.isHouse()){
                game.bmd.draw(house, i * house.width, j * house.height);
            }
            else {
                game.bmd.draw(lake, i * lake.width, j * lake.height);
            }
        }
    }
}
function build_tower() {
    update_money(towercost);
    update_money(revenue)
}

function update_money(value) {
    money += value;
    moneytext.setText("$ " + money);
}
