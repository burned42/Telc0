//-> telc0.js
//let game = new Phaser.Game(800, 600, Phaser.CANVAS, '', {preload: preload, create: create, update: update});
/*
let moneytext;
let lastmaintenance;
let timenow;
*/
// TODO change values
/*
let money = 2000;
let towercost = -1000;
let revenue = 50 * 22;
let maintenanceinterval = 10 * 1000;
let maintenancecost = -100;
*/

/* -> gamePreload.js
function preload() {
    game.load.image('house_small', 'assets/images/house_small.png');
    game.load.image('lake', 'assets/images/lake.png');
    game.load.image('green', 'assets/images/green.png');
}
*/

let runningGame = function () {
    // do something…
};

runningGame.prototype = {
    create: function () {
        game.map = new Map(32, 32, 120);
        house = game.make.sprite(0, 0, 'house_small');
        lake = game.make.sprite(0, 0, 'lake');
        green = game.make.sprite(0, 0, 'green');

        lake.anchor.set(0.5);
        lake.scale.setTo(0.5, 0.5);

        house.anchor.set(0.5);
        house.scale.setTo(0.5, 0.5);

        green.anchor.set(0.5);
        green.scale.setTo(0.5, 0.5);

        //	This is the BitmapData we're going to be drawing to
        game.bmd = game.add.bitmapData(game.width, game.height);
        game.bmd.addToWorld();

        //	Disables anti-aliasing when we draw sprites to the BitmapData
        game.bmd.smoothed = false;

        //  Show the moneytext
        let bar = game.add.graphics();
        bar.beginFill(0x000000, 0.2);
        bar.drawRect(0, 20, 150, 40);
        moneytext = game.add.text(30, 30, "$ " + money, {font: "bold 19px Arial", fill: "#edff70"});

        lastmaintenance = game.time.now;
    }

    update: function () {
        timenow = game.time.now;
        if (timenow - lastmaintenance > maintenanceinterval) {
            lastmaintenance = game.time.now;
            update_money(maintenancecost * game.map.getTowerCount())
        }
        if (money < towercost) {
            // TODO End the game
        }
        game.input.onDown.addOnce(build_tower, this);
        /* TC, TODO
        game.input.onTap.addOnce(build_tower, this);
        */
        renderMap();
    }
};

function renderMap() {
    game.bmd.clear();
    for (let i = 0; i < game.map.width; i++){
        for (let j =0; j < game.map.height; j++){
            let cell = game.map.getMap()[i][j];
            if (cell.isHouse()){
                game.bmd.draw(house, i * house.width, j * house.height);
            }
            else {
                game.bmd.draw(green, i * green.width, j * green.height);
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
