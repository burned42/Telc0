let runningGame = function () {
    // do something…
};

runningGame.prototype = {
    create: function () {
        game.world.setBounds(0, 0, 1920, 1200);
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
    }
};

function render() {
    randerMap();
    game.debug.cameraInfo(game.camera, 32, 32);
}

function renderMap() {
    // game.bmd.clear();
    for (let x = 0; x < game.map.width; x++) {
        for (let y = 0; y < game.map.height; y++) {
            let cell = game.map.getCell(x, y);
            if (cell.isHouse()) {
                game.bmd.draw(house, x * house.width, y * house.height);
            }
            else {
                game.bmd.draw(green, x * green.width, y * green.height);
            }
        }
    }
}

function build_tower() {
    update_money(towercost, false);
    update_money(revenue);

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
