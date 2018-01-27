let runningGame = function () {
    // do something…
};


runningGame.prototype = {
    preload: function () {

    },

    create: function () {
        this.game.world.setBounds(0, 0, 32 * 128, 32 * 128);
        this.game.camera.width = 800;
        this.game.camera.height = 600;
        generatedMap = new Map(32, 32, 100);
        this.game.map = generatedMap;
        this.game.load.tilemap('generatedMap', null, generatedMap.getMapAsCsv(), Phaser.Tilemap.CSV);

        map = this.game.add.tilemap('generatedMap', 128, 128, generatedMap.width, generatedMap.height);
        map.addTilesetImage('Map', 'tiles');
        layer = map.createLayer(0);


        let start = this.findFirstTower();
        this.game.camera.x = start.x * 128;
        this.game.camera.y = start.y * 128;

        cursors = this.game.input.keyboard.createCursorKeys();

        let bar = this.game.add.graphics();
        bar.beginFill(0x000000, 0.2);
        bar.drawRect(0, 20, 150, 40);
        moneytext = this.game.add.text(30, 30, "$ " + money, {font: "bold 19px Arial", fill: "#edff70"});
        bar.fixedToCamera = true;
        moneytext.fixedToCamera = true;

        cashgood = this.game.add.audio('cashGood');
        cashbad = this.game.add.audio('cashBad');

        theme = this.game.add.audio('backgroundTheme', 1, true);
        theme.play();

        lastmaintenance = this.game.time.now;
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
            this.update_money(maintenancecost * this.game.map.getTowerCount())
        }
        if (money < towercost) {
            // TODO End the this.game
        }
        this.game.input.onDown.addOnce(this.build_tower, this);
        /* TC, TODO
        this.game.input.onTap.addOnce(build_tower, this);
        */
    },

    render: function() {
        // this.game.debug.cameraInfo(this.game.camera, 32, 32);
    },

    build_tower: function () {
        let x = layer.getTileX(this.game.input.activePointer.worldX);
        let y = layer.getTileY(this.game.input.activePointer.worldY);
        let current_tile = this.game.map.getCell(x, y);

        if (current_tile.isEmpty()) {
            this.game.map.buildTower(x, y);
            this.update_money(towercost, false);
            // TODO calculate revenue
            this.update_money(revenue);
        }
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
