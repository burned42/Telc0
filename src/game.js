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
}

function create() {
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
}

function build_tower() {
    update_money(towercost);
    update_money(revenue)
}

function update_money(value) {
    money += value;
    moneytext.setText("$ " + money);
}