let runningGame = function () {
    // do something…

    this.cursors = null;
    this.cashGood = null;
    this.cashBad = null;
    this.graphics = null;
    this.blink = 0.3;
};


runningGame.prototype = {
    preload: function () {

    },

    create: function () {
        this.game.world.setBounds(0, 0, 32 * 128, 32 * 128);
        this.game.camera.width = 800;
        this.game.camera.height = 600;
        let generatedMap = new Map(32, 32, 100, 50);
        this.game.map = generatedMap;
        this.game.load.tilemap('generatedMap', null, generatedMap.getMapAsCsv(), Phaser.Tilemap.CSV);

        this.game.tilemap = this.game.add.tilemap('generatedMap', 128, 128, generatedMap.width, generatedMap.height);
        this.game.tilemap.addTilesetImage('Map', 'tiles');
        this.game.tilelayer = this.game.tilemap.createLayer(0);

        this.graphics = this.game.add.graphics(0, 0);

        // graphics.lineStyle(2, 0xffd900, 1);

        let start = this.findBaseTower();
        this.game.camera.x = start.x * 128 - this.game.width / 2;
        this.game.camera.y = start.y * 128 - this.game.height / 2;

        this.cursors = this.game.input.keyboard.createCursorKeys();

        this.escKey = this.game.input.keyboard.addKey(Phaser.Keyboard.ESC);

        let bar = this.game.add.graphics();
        bar.beginFill(0x000000, 0.2);
        moneytext = this.game.add.text(30, 30, "$ " + money, {font: "bold 19px Arial", fill: "#edff70"});
        bar.fixedToCamera = true;
        moneytext.fixedToCamera = true;

        this.cashGood = this.game.add.audio('cashGood');
        this.cashBad = this.game.add.audio('cashBad');

        this.game.add.audio('backgroundTheme', 1, true).play();

        let numofbirds = 6;
        this.game.birds = [];
        for (let i = 0; i < numofbirds; i++) {
            let aktbird = this.game.add.sprite(this.game.camera.x + Math.floor(Math.random() * this.game.camera.width + 1), this.game.camera.y + Math.floor(Math.random() * this.game.camera.height + 1), 'bird');
            aktbird.animations.add('fly');
            aktbird.animations.play('fly', 10, true);
>>>>>>> Let Birds turn around when hitting the corner
            this.game.birds.push(aktbird);
        }

        lastmaintenance = this.game.time.now;

        this.stage = this.game.make.bitmapData(this.game.world.width, this.game.world.height);
        this.miniMap = this.game.make.bitmapData(150, 150);
        this.miniMapContainer = this.game.make.sprite(this.game.width - 150, this.game.height - 150, this.miniMap);
        this.game.stage.addChild(this.miniMapContainer);
    },

    update: function () {
        if (this.escKey.isDown) {
            location.reload();
        }
        if (this.cursors.up.isDown) {
            this.game.camera.y -= 4;
        } else if (this.cursors.down.isDown) {
            this.game.camera.y += 4;
        }

        if (this.cursors.left.isDown) {
            this.game.camera.x -= 4;
        } else if (this.cursors.right.isDown) {
            this.game.camera.x += 4;
        }

        this.calculate_maintenance();
        if (money < towercost) {
            // TODO End the this.game
        }
        this.game.input.onDown.addOnce(this.build_tower, this);
        // this.render();

        let miniMapViewportX = this.game.camera.x * 150 / this.game.world.width;
        let miniMapViewportY = this.game.camera.y * 150 / this.game.world.height;
        this.stage.drawFull(this.game.world);
        this.miniMap.rect(0, 0, this.miniMap.width, this.miniMap.height, '#000000');
        this.miniMap.copy(this.stage, 0, 0, this.stage.width, this.stage.height, 2 + miniMapViewportX, 2 + miniMapViewportY, this.miniMap.width - 4, this.miniMap.height - 4);
        this.stage.clear();
        this.miniMap.update();

        this.animate_world();
    },

    render: function() {
        this.graphics.clear();
        this.graphics.beginFill(0x000000, this.blink);
        // this.game.debug.cameraInfo(this.game.camera, 32, 32);
        for (let x = 0; x < this.game.map.width; x++){
            for (let y = 0; y < this.game.map.height; y++){
                let cell = this.game.map.getCell(x, y);
                if (cell.covered) {
                    this.graphics.drawRoundedRect(128 * x, 128 * y, 132, 132, 64);
                }
            }
        }
    },

    build_tower: function () {
        let x = this.game.tilelayer.getTileX(this.game.input.activePointer.worldX);
        let y = this.game.tilelayer.getTileY(this.game.input.activePointer.worldY);
        let current_tile = this.game.map.getCell(x, y);

        if (this.game.map.isConnectedToNetwork(x, y)){
            this.game.map.coverAt(x, y);
        }

        if (current_tile.isEmpty()) {
            this.game.map.buildTower(x, y);
            this.update_money(towercost, false);
            this.game.tilemap.putTile(1, x, y);
            this.money_effect(x, y, towercost);
            let revenue = this.calculate_revenue();
            this.update_money(revenue);
        }


        for (let x = 0; x < this.game.map.width; x++) {
            for (let y = 0; y < this.game.map.height; y++) {
                let cell = this.game.map.getCell(x, y);
                if (cell.isTower() && this.game.map.isConnectedToNetwork(x, y)) {
                    this.game.map.coverAt(x, y);
                }
            }
        }
    },

    findBaseTower: function () {
        for (let x = 0; x < this.game.map.width; x++) {
            for (let y = 0; y < this.game.map.height; y++) {
                let cell = this.game.map.getCell(x, y);
                if (cell.isBaseTower() === true) {
                    this.game.map.coverAt(x, y);
                    return {x: x, y: y};
                }
            }
        }
    },

    calculate_maintenance: function() {
        timenow = this.game.time.now;
        if (timenow - lastmaintenance > maintenanceinterval) {
            lastmaintenance = this.game.time.now;
            this.update_money(maintenancecost * this.game.map.getTowerCount());
        }
        for (let x = 0; x < this.game.map.width; x++) {
            for (let y = 0; y < this.game.map.height; y++) {
                let cell = this.game.map.getCell(x, y);
                if (cell.isTower()) {
                    this.money_effect(x, y, maintenancecost);
                }
            }
        }
    },

    calculate_revenue: function() {
        let revenue = 0;
        for (let x = 0; x < this.game.map.width; x++) {
            for (let y = 0; y < this.game.map.height; y++) {
                let cell = this.game.map.getCell(x, y);
                if (cell.isHouse() && cell.covered && ! cell.paidFor) {
                    revenue += revenueHouse;
                    cell.paidFor = true;
                    this.money_effect(x, y, revenueHouse);
                }
            }
        }
        return revenue;
    },

    update_money: function (value, playsound=true) {
        if (playsound) {
            if (value >= 0) {
                this.cashGood.play();
            } else {
                this.cashBad.play();
            }
        }
        money += value;
        moneytext.setText("$ " + money);
    },

    animate_world: function() {
        // Let the Birds fly
        let birdspeed = 2;
        for (let i = 0; i < this.game.birds.length; i++) {
            let aktbird = this.game.birds[i];
            if (aktbird.rotation === 0) {
                aktbird.y -= birdspeed;
            }
            if (aktbird.rotation === 90) {
                aktbird.x += birdspeed;
            }
            if (aktbird.rotation === 180) {
                aktbird.y += birdspeed;
            }
            if (aktbird.rotation === 270) {
                aktbird.x -= birdspeed;
            }

            // Change rotation sometimes
            if (Math.random() > 0.97) {
                aktbird.rotation += 90;

                if (aktbird.rotation === 360) {
                    aktbird.rotation = 0;
                }
            }
            
            // Rotate them when at the end of map
            if (aktbird.x < 0) {
                aktbird.rotation = 90;
            }
            if (aktbird.y < 0) {
                aktbird.rotation = 180;
            }
            if (aktbird.x > this.game.camera.width) {
                aktbird.rotation = 270;
            }
            if (aktbird.y > this.game.camera.height) {
                aktbird.rotation = 0;
            }
        }
    },

    money_effect: function (x, y, value) {
        let fontconfig;
        if (value >= 0) {
            // color green
            fontconfig = {font: "bold 16pt Arial", fill: "#edff70"};
        } else {
            // color red
            fontconfig = {font: "bold 16pt Arial", fill: "#ff0000"};
        }
        let effectX = (x * cellSize) + (cellSize/2);
        let effectY = (y * cellSize) + (cellSize/2);

        let text = this.game.add.text(effectX, effectY, "$ " + value, fontconfig);

        this.game.add.tween(text).to({alpha: 0}, 1000, Phaser.Easing.Default, true, 1000);
    }
};
