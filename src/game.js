let runningGame = function () {
    this.cursors = null;
    this.cashGood = null;
    this.cashBad = null;
    this.graphics = null;
    this.blink = 0.3;
    this.texts = [];
    this.colorBuild = 0x9FFA3B;
    this.colorFail = 0xFF003B;
};


runningGame.prototype = {
    preload: function () {
    },

    create: function () {
        this.game.world.setBounds(0, 0, mapRows * cellSize, mapCols * cellSize);
        this.game.camera.width = viewport.w;
        this.game.camera.height = viewport.h;
        let generatedMap = new Map(mapRows, mapCols, 100, 50);
        this.game.map = generatedMap;
        this.game.load.tilemap('generatedMap', null, generatedMap.getMapAsCsv(), Phaser.Tilemap.CSV);

        this.game.tilemap = this.game.add.tilemap('generatedMap', cellSize, cellSize, generatedMap.width, generatedMap.height);
        this.game.tilemap.addTilesetImage('Map', 'tiles');
        this.game.tilelayer = this.game.tilemap.createLayer(0);

        this.graphics = this.game.add.graphics(0, 0);

        // The rabbits are no static tiles, they move and are in fact a spritesheet (tileid is 4)
        let rabbits = this.game.add.group();
        rabbits.enableBody = true;
        this.game.tilemap.createFromObjects('generatedMap', 4, 'greenGrassRabbitMoving', 0, true, false, rabbits);
        rabbits.callAll('animations.add', 'animations', 'spin', [0, 1, 2, 3], 10, true);
        rabbits.callAll('animations.play', 'animations', 'spin');

        // graphics.lineStyle(2, 0xffd900, 1);

        let start = this.findBaseTower();
        this.game.camera.x = start.x * cellSize - cellSize/ 2;
        this.game.camera.y = start.y * cellSize - cellSize / 2;

        this.cursors = this.game.input.keyboard.createCursorKeys();

        this.escKey = this.game.input.keyboard.addKey(Phaser.Keyboard.ESC);
        this.keyW = this.game.input.keyboard.addKey(Phaser.Keyboard.W);
        this.keyA = this.game.input.keyboard.addKey(Phaser.Keyboard.A);
        this.keyS = this.game.input.keyboard.addKey(Phaser.Keyboard.S);
        this.keyD = this.game.input.keyboard.addKey(Phaser.Keyboard.D);

        this.bar = this.game.add.graphics();
        this.bar.beginFill(0x0c0c0c, 0.2);
        moneytext = this.game.add.text(30, 30, "$ " + money, {font: "bold 19px Arial", fill: "#edff70"});
        this.bar.drawRect(0, 20, 150, 40);
        this.bar.fixedToCamera = true;
        moneytext.fixedToCamera = true;

        this.cashGood = this.game.add.audio('cashGood');
        this.cashBad = this.game.add.audio('cashBad');

        this.game.add.audio('backgroundTheme', 1, true).play();

        this.game.birds = [];
        for (let i = 0; i < numofbirds; i++) {
            let aktbird = this.game.add.sprite(this.game.camera.x + Math.floor(Math.random() * this.game.world.width + 1), this.game.camera.y + Math.floor(Math.random() * this.game.world.height + 1), 'bird');
            aktbird.animations.add('fly');
            aktbird.animations.play('fly', 10, true);
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
            this.game.state.start('menu');
        }

        if (this.cursors.up.isDown || this.keyW.isDown) {
            this.game.camera.y -= 15;
        } else if (this.cursors.down.isDown || this.keyS.isDown) {
            this.game.camera.y += 15;
        }

        if (this.cursors.left.isDown || this.keyA.isDown) {
            this.game.camera.x -= 15;
        } else if (this.cursors.right.isDown || this.keyD.isDown) {
            this.game.camera.x += 15;
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

        if (money <= 0) {
            money = startMoney;
            this.game.state.start('gameOver');
        }
    },

    render: function() {
        this.graphics.clear();
        let now = this.game.time.now;
        for (let t in this.texts) {
            if (t.birth - now <= 100){
                this.game.text.remove(t);
            }
        }

        this.graphics.beginFill(0x000000, 0.3);
        this.game.debug.cameraInfo(this.game.camera, 32, 32);
        for (let x = 0; x < this.game.map.width; x++){
            for (let y = 0; y < this.game.map.height; y++){
                let cell = this.game.map.getCell(x, y);
                if (cell.covered) {
                    this.graphics.drawRoundedRect(cellSize * x, cellSize * y, cellSize, cellSize, 4);
                }
            }
        }
    },

    build_tower: function () {
        let x = this.game.tilelayer.getTileX(this.game.input.activePointer.worldX);
        let y = this.game.tilelayer.getTileY(this.game.input.activePointer.worldY);
        let current_tile = this.game.map.getCell(x, y);

        if (current_tile.isEmpty() && !current_tile.isBlocked()) {
            this.game.map.buildTower(x, y);
            this.update_money(towercost, false);
            this.game.tilemap.putTile(1, x, y);
            this.money_effect(x, y, towercost);
            if (this.game.map.isConnectedToNetwork(x, y)){
                this.game.map.coverAt(x, y);
            }
            let revenue = this.calculate_revenue();
            this.update_money(revenue);

            this.flash_build_success();
            let towers = this.game.map.towers;
            for (let t in towers) {
                if(this.game.map.isConnectedToNetwork(t.x, t.y)){
                    this.game.map.coverAt(x, y);
                }
            }
        }
        else  {
            this.flash_build_fails();
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
            for (let x = 0; x < this.game.map.width; x++) {
                for (let y = 0; y < this.game.map.height; y++) {
                    let cell = this.game.map.getCell(x, y);
                    if (cell.isTower()) {
                        this.money_effect(x, y, maintenancecost);
                    }
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
        this.calculate_coverage();
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
            if (Math.random() > 0.98) {
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
            if (aktbird.x > this.game.world.width) {
                aktbird.rotation = 270;
            }
            if (aktbird.y > this.game.world.height) {
                aktbird.rotation = 0;
            }
        }
    },

    flash_build_success: function () {
        this.game.camera.flash(this.colorBuild, 200);

    },


    flash_build_fails: function () {
        this.game.camera.flash(this.colorFail, 200);

    },

    money_effect: function (x, y, value) {
        let fontconfig = {antialias: false, font: "bold 16pt Arial"};
        if (value >= 0) {
            // color green
            fontconfig.fill = "#edff70";
        } else {
            // color red
            fontconfig.fill = "#ff0000";
        }
        let effectX = (x * cellSize) + (cellSize/4);
        let effectY = (y * cellSize) + (cellSize/2);
        let text = this.game.add.text(effectX, effectY, "$ " + value, fontconfig);
        text.birth = this.game.time.now;

        this.texts.push(text);

        this.game.add.tween(text).to({alpha: 0}, 1000, Phaser.Easing.Default, true, 1000);
    },

    calculate_coverage: function () {
        let countCoveredHouses = 0;
        for (let x = 0; x < this.game.map.width; x++) {
            for (let y = 0; y < this.game.map.height; y++) {
                let cell = this.game.map.getCell(x, y);
                if (cell.paidFor) {
                   countCoveredHouses++;
                }
            }
        }

        if (countCoveredHouses === this.game.map.houses.length) {
            //coverage % calculation here…
            this.game.state.start('gameOver');
        }
    }
};
