let game = new Phaser.Game(800, 600, Phaser.CANVAS, 'telc0', {
    preload: preload,
    create: create,
    update: update,
    render: render
});

let moneytext;
let lastmaintenance;
let timenow;
var cursors;

let cashgood;
let cashbad;

// TODO change values
let money = 2000;
let towercost = -1000;
let revenue = 50 * 22;
let maintenanceinterval = 10 * 1000;
let maintenancecost = -100;


function preload() {
    game.load.image('tiles', 'assets/images/tilemap.png');
    game.load.image('house_small', 'assets/images/house_small.png');
    game.load.image('lake', 'assets/images/lake.png');
    game.load.image('green', 'assets/images/green.png');
    game.load.audio('cashBad', 'assets/sounds/cashbad.mp3');
    game.load.audio('cashGood', 'assets/sounds/cashgood.mp3');
}

function create() {
    game.world.setBounds(0, 0, 2000 * 32, 2000 * 32);
    generatedMap = new Map(32, 32, 100);
    game.map = generatedMap;
    game.load.tilemap('generatedMap', null, generatedMap.getMapAsCsv(), Phaser.Tilemap.CSV);

    map = game.add.tilemap('generatedMap', 128, 128, generatedMap.width, generatedMap.height);
    map.addTilesetImage('Map', 'tiles');
    layer = map.createLayer(0);

    //	This is the BitmapData we're going to be drawing to
    game.bmd = game.add.bitmapData(game.width, game.height);
    game.bmd.addToWorld();

    //	Disables anti-aliasing when we draw sprites to the BitmapData
    game.bmd.smoothed = false;
    let start = findFirstTower();
    game.camera.x = start.x * 128;
    game.camera.y = start.y * 128;

    cursors = game.input.keyboard.createCursorKeys();
    //  Show the moneytext
    let bar = game.add.graphics();
    bar.beginFill(0x000000, 0.2);
    bar.drawRect(0, 20, 150, 40);
    moneytext = game.add.text(30, 30, "$ " + money, {font: "bold 19px Arial", fill: "#edff70"});

    lastmaintenance = game.time.now;

    cashgood = game.add.audio('cashGood');
    cashbad = game.add.audio('cashBad');
}

function update() {
    if (cursors.up.isDown)
    {
        game.camera.y -= 4;
    }
    else if (cursors.down.isDown)
    {
        game.camera.y += 4;
    }

    if (cursors.left.isDown)
    {
        game.camera.x -= 4;
    }
    else if (cursors.right.isDown)
    {
        game.camera.x += 4;
    }

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
}

function render() {
    game.debug.cameraInfo(game.camera, 32, 32);
}

function build_tower() {
    update_money(towercost);
    update_money(revenue)
}

function findFirstTower() {
    for (let i =0; i < game.map.width; i++){
        for (let j = 0; j < game.map.height; j++){
            let cell = game.map.getCell(i, j);
            if (cell.isTower() === true){
                return {x: i, y: j};
            }
        }
    }
}

    


function update_money(value, playsound=true) {
    if (playsound) {
        if (value >= 0) {
            cashgood.play();
        } else {
            cashbad.play();
        }
    }
    money += value;
    moneytext.setText("$ " + money);
}
