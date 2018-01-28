let runningGame = function () {
    this.cursors = null;
    this.cashGood = null;
    this.cashBad = null;
    this.gameAudio = null;
    this.graphics = null;
    this.texts = [];
    this.colorBuild = 0x9FFA3B;
    this.colorFail = 0xFF003B;
    this.rabbit = null;
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


        for (let x = 0; x < this.game.map.width; x++) {
            for (let y = 0; y < this.game.map.height; y++) {

                let cell = this.game.map.getCell(x, y);

                if (cell.isDuck()){
                    let duck = this.game.add.sprite(x*cellSize, y*cellSize, 'swimmingDuck');
                    duck.animations.add('swim');
                    duck.animations.play('swim', (Math.random() * 3 + 2), true);
                }

                else if (cell.isRabbit()){
                    let rabbit = this.game.add.sprite(x*cellSize, y*cellSize, 'greenGrassRabbitMoving');
                    rabbit.animations.add('hop');
                    rabbit.animations.play('hop', (Math.random() * 3 + 2), true);
                    rabbit.inputEnabled = true;
                    rabbit.events.onInputDown.add(function (s) {
                        s.destroy();
                    });
                }
            }
        }

        this.game.birds = [];
        for (let i = 0; i < numOfBirds; i++) {
            let bird = this.game.add.sprite(Math.floor(Math.random() * this.game.world.width + 1), Math.floor(Math.random() * this.game.world.height + 1), 'bird');
            bird.animations.add('fly');
            bird.animations.play('fly', (Math.random() * 5 + 4), true);
            this.game.birds.push(bird);
        }

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

        this.gameAudio = this.game.add.audio('backgroundTheme', 1, true).play();

        lastBillingRun = this.game.time.now;

        this.stage = this.game.make.bitmapData(this.game.world.width, this.game.world.height);
        this.miniMap = this.game.make.bitmapData(150, 150);
        this.miniMapContainer = this.game.make.sprite(this.game.width - 150, this.game.height - 150, this.miniMap);
        this.graphics = this.game.add.graphics(0, 0);
        this.game.stage.addChild(this.miniMapContainer);

        countCoveredHouses = 0;
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

        this.periodicBilling();
        if (money < 0) {
            money = startMoney;
            this.game.state.start('gameOver');
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
        this.graphics.beginFill(0x000FF0, 0.2);
        let now = this.game.time.now;
        for (let t in this.texts) {
            if (t.birth - now <= 100){
                this.game.text.remove(t);
            }
        }

        // this.game.debug.cameraInfo(this.game.camera, 32, 32);
        for (let x = 0; x < this.game.map.width; x++){
            for (let y = 0; y < this.game.map.height; y++){
                let cell = this.game.map.getCell(x, y);
                if (cell.covered) {
                    this.graphics.drawRoundedRect(cellSize * x, cellSize * y, cellSize, cellSize, 0.4);
                }
            }
        }
        this.graphics.endFill();
    },

    shutdown: function() {
        this.gameAudio.stop();
        this.miniMap.destroy();
    },

    build_tower: function () {
        let x = this.game.tilelayer.getTileX(this.game.input.activePointer.worldX);
        let y = this.game.tilelayer.getTileY(this.game.input.activePointer.worldY);
        let current_tile = this.game.map.getCell(x, y);

        if (current_tile.isEmpty() && !current_tile.isBlocked()) {
            this.game.map.buildTower(x, y);
            this.updateMoney(towerInitialCost, false);
            this.game.tilemap.putTile(1, x, y);
            this.moneyEffect(x, y, towerInitialCost);
            if (this.game.map.isConnectedToNetwork(x, y)){
                this.game.map.coverAt(x, y);
            }
            let revenue = this.calculate_revenue();
            this.updateMoney(revenue);

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
        for (let i = 0; i < this.game.map.towers.length; i++) {
            let tower = this.game.map.towers[i];
            let cell = this.game.map.getCell(tower.x, tower.y);
            if (cell.isBaseTower()) {
                return {x: tower.x, y: tower.y};
            }
        }
    },

    periodicBilling: function() {
        let timeNow = this.game.time.now;
        if ((timeNow - lastBillingRun) > (billingIntervalSeconds * 1000)) {
            lastBillingRun = timeNow;

            // pay maintenance for towers and display effects
            this.updateMoney(this.game.map.getTowerCount() * towerMaintenanceCost);
            for (let i = 0; i < this.game.map.towers.length; i++) {
                let tower = this.game.map.towers[i];
                let cell = this.game.map.getCell(tower.x, tower.y);
                if (cell.isTower()) {
                    this.moneyEffect(tower.x, tower.y, towerMaintenanceCost);
                }
            }

            // get money from houses
            let coveredHouses = 0;
            for (let i = 0; i < this.game.map.houses.length; i++) {
                let house = this.game.map.houses[i];
                let cell = this.game.map.getCell(house.x, house.y);
                if (cell.isHouse() && cell.covered) {
                    coveredHouses++;
                    this.moneyEffect(house.x, house.y, housePeriodicRevenue);
                }
            }
            this.updateMoney(coveredHouses * housePeriodicRevenue);
        }
    },

    calculate_revenue: function() {
        let revenue = 0;
        for (let x = 0; x < this.game.map.width; x++) {
            for (let y = 0; y < this.game.map.height; y++) {
                let cell = this.game.map.getCell(x, y);
                if (cell.isHouse() && cell.covered && ! cell.paidFor) {
                    revenue += houseInitialRevenue;
                    cell.paidFor = true;
                    this.moneyEffect(x, y, houseInitialRevenue);
                }
            }
        }
        this.calculate_coverage();

        return revenue;
    },

    updateMoney: function (value, playsound=true) {
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

    moneyEffect: function (x, y, value) {
        let fontconfig = {antialias: false, font: "bold 16pt Arial"};
        if (value >= 0) {
            // color green
            fontconfig.fill = "#00ff00";
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
        for (let i = 0; i < this.game.map.houses.length; i++) {
            let houses = this.game.map.houses[i];
            let cell = this.game.map.getCell(houses.x, houses.y);
            if (cell.isHouse() && cell.paidFor) {
                countCoveredHouses++;
            }
        }

        if (countCoveredHouses === this.game.map.houses.length) {
            this.game.state.start('gameOver');
        }
    },

};

