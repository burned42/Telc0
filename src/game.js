let runningGame = function () {
    // do something…
};

<<<<<<< HEAD
runningGame.prototype = {
    create: function () {
        game.map = new Map(32, 32, 120);
        house = game.make.sprite(0, 0, 'house_small');
        lake = game.make.sprite(0, 0, 'lake');
        green = game.make.sprite(0, 0, 'green');

        lake.anchor.set(0.5);
        lake.scale.setTo(0.5, 0.5);
=======

runningGame.prototype = {
    preload: function () {

    },

    create: function () {
        this.game.world.setBounds(0, 0, 2000 * 32, 2000 * 32);
        generatedMap = new Map(32, 32, 100);
        this.game.map = generatedMap;
        this.game.load.tilemap('generatedMap', null, generatedMap.getMapAsCsv(), Phaser.Tilemap.CSV);

        map = this.game.add.tilemap('generatedMap', 128, 128, generatedMap.width, generatedMap.height);
        map.addTilesetImage('Map', 'tiles');
        layer = map.createLayer(0);
>>>>>>> 65b69e8... ARCH + TILEMAP = BERND NERVT

        house.anchor.set(0.5);
        house.scale.setTo(0.5, 0.5);

<<<<<<< HEAD
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
=======
        let start = this.findFirstTower();
        this.game.camera.x = start.x * 128;
        this.game.camera.y = start.y * 128;

        cursors = this.game.input.keyboard.createCursorKeys();

        let bar = this.game.add.graphics();
        bar.beginFill(0x000000, 0.2);
        bar.drawRect(0, 20, 150, 40);
        moneytext = this.game.add.text(30, 30, "$ " + money, {font: "bold 19px Arial", fill: "#edff70"});

        cashgood = this.game.add.audio('cashGood');
        cashbad = this.game.add.audio('cashBad');
    },

    update: function () {
        if (cursors.up.isDown)
        {
            this.game.camera.y -= 4;
        }
        else if (cursors.down.isDown)
        {
            this.game.camera.y += 4;
        }

        if (cursors.left.isDown)
        {
            this.game.camera.x -= 4;
        }
        else if (cursors.right.isDown)
        {
            this.game.camera.x += 4;
        }

        timenow = this.game.time.now;
        if (timenow - lastmaintenance > maintenanceinterval) {
            lastmaintenance = this.game.time.now;
        }

        timenow = this.game.time.now;
>>>>>>> 65b69e8... ARCH + TILEMAP = BERND NERVT
        if (timenow - lastmaintenance > maintenanceinterval) {
            lastmaintenance = this.game.time.now;
            this.update_money(maintenancecost * this.game.map.getTowerCount())
        }
        if (money < towercost) {
            // TODO End the this.game
        }
        this.game.input.onDown.addOnce(this.build_tower, this);
        /* TC, TODO
        this.game.input.onTap.addOnce(build_tower, this);
        */
<<<<<<< HEAD
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
=======
    },

    render: function() {
        this.game.debug.cameraInfo(this.game.camera, 32, 32);
    },

    build_tower: function () {
        this.update_money(towercost);
        this.update_money(revenue)
    },

    findFirstTower: function () {
        for (let i =0; i < this.game.map.width; i++){
            for (let j = 0; j < this.game.map.height; j++){
                let cell = this.game.map.getCell(i, j);
                if (cell.isTower() === true){
                    return {x: i, y: j};
                }
            }
        }
    },

    update_money: function (value, playsound=true) {
        if (playsound) {
            if (value >= 0) {
                cashgood.play();
            } else {
                cashbad.play();
            }
        }
        money += value;
        moneytext.setText("$ " + money);
        {

        }
    }

};
>>>>>>> 65b69e8... ARCH + TILEMAP = BERND NERVT
