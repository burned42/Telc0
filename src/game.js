var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });

var moneytext;
var lastrent;
var timenow;

// TODO change values
var money = 5;
var towercost = -5;
var revenue = 10;
var rentintervall = 60 * 1000;
var rent = -2;


function preload() {
}

function create() {
    moneytext = game.add.text(30, 30, "$ " + money, { font: "17px Arial", fill: "#edff70"});
    lastrent = game.time.now;
}

function update() {
    timenow = game.time.now;
    if (timenow - lastrent > rentintervall) {
        lastrent = game.time.now;
        update_money(rent)
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