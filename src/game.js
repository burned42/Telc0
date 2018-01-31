let runningGame = function () {
    this.cursors = null;
    this.cashGood = null;
    this.cashBad = null;
    this.gameAudio = null;
    this.graphics = null;
    this.marker = null;
    this.texts = [];
    this.colorBuild = 0x9FFA3B;
    this.colorFail = 0xFF003B;
    this.moneyText = null;
    this.scoreText = null;
    this.timeText = null;
    this.lastBillingRun = null;
};

runningGame.prototype = {
    preload: function () {
    },

    create: function () {
        // Create Worldmap
        this.game.world.setBounds(0, 0, mapRows * cellSize, mapCols * cellSize);
        this.game.camera.width = viewport.w;
        this.game.camera.height = viewport.h;
        let generatedMap = new Map(mapRows, mapCols, numOfHouses, numOfNature, numOfRoads);
        this.game.map = generatedMap;
        this.game.load.tilemap('generatedMap', null, generatedMap.getMapAsCsv(), Phaser.Tilemap.CSV);

        // Create Tiles in Map
        this.game.tilemap = this.game.add.tilemap('generatedMap', cellSize, cellSize, generatedMap.width, generatedMap.height);
        this.game.tilemap.addTilesetImage('Map', 'tiles');
        this.game.tilelayer = this.game.tilemap.createLayer(0);

        // Create Animated Tiles in Map
        for (let x = 0; x < this.game.map.width; x++) {
            for (let y = 0; y < this.game.map.height; y++) {
                let cell = this.game.map.getCell(x, y);

                if (cell.isDuck()) {
                    let duck = this.game.add.sprite(x * cellSize, y * cellSize, 'swimmingDuck');
                    duck.animations.add('swim');
                    duck.animations.play('swim', (Math.random() * 3 + 2), true);
                } else if (cell.isRabbit()) {
                    let rabbit = this.game.add.sprite(x * cellSize, y * cellSize, 'greenGrassRabbitMoving');
                    rabbit.animations.add('hop');
                    rabbit.animations.play('hop', (Math.random() * 3 + 2), true);
                    rabbit.inputEnabled = true;
                    rabbit.events.onInputDown.add(function (s) {
                        s.destroy();
                    });
                }
            }
        }

        // Create the birds
        this.game.birds = [];
        for (let i = 0; i < numOfBirds; i++) {
            let bird = this.game.add.sprite(Math.floor(Math.random() * this.game.world.width + 1), Math.floor(Math.random() * this.game.world.height + 1), 'bird');
            bird.animations.add('fly');
            bird.animations.play('fly', (Math.random() * 5 + 4), true);
            this.game.birds.push(bird);
        }

        // Create the markers for the tile under the cursor
        this.marker = this.game.add.graphics();

        // Create the start position
        let start = this.getBaseTower();
        this.game.camera.x = start.x * cellSize - this.camera.width / 2;
        this.game.camera.y = start.y * cellSize - this.camera.height / 2;

        // Add Cursor and other Keys
        this.cursors = this.game.input.keyboard.createCursorKeys();

        this.escKey = this.game.input.keyboard.addKey(Phaser.Keyboard.ESC);
        this.keyW = this.game.input.keyboard.addKey(Phaser.Keyboard.W);
        this.keyA = this.game.input.keyboard.addKey(Phaser.Keyboard.A);
        this.keyS = this.game.input.keyboard.addKey(Phaser.Keyboard.S);
        this.keyD = this.game.input.keyboard.addKey(Phaser.Keyboard.D);

        // Add Sounds
        this.cashGood = this.game.add.audio('cashGood');
        this.cashBad = this.game.add.audio('cashBad');

        this.gameAudio = this.game.add.audio('backgroundTheme', 1, true).play();

        // Prepare the billing run
        this.lastBillingRun = this.game.time.now;

        // Add the Minimap
        this.miniMap = this.game.make.bitmapData(150, 150);
        this.miniMapContainer = this.game.make.sprite(this.game.width - 150, this.game.height - 150, this.miniMap);
        this.miniMapContainer.alpha = 0.5;
        this.graphics = this.game.add.graphics(0, 0);
        this.game.stage.addChild(this.miniMapContainer);

        // Add the score and money text
        score = 0;
        let timePlayedRaw = this.game.time.totalElapsedSeconds() / 60.0;
        timeGameStartedAt = timePlayedRaw;
        let timePlayedMin = Math.floor(timePlayedRaw);
        let timePlayedSec = timePlayedRaw * 60 % 60;
        timePlayedSec = Math.floor(timePlayedSec);

        this.bar = this.game.add.graphics();
        this.bar.beginFill(0x0c0c0c, 0.2);
        this.moneyText = this.game.add.text(30, 30, "$ " + money + " ", {font: "bold 19px Arial", fill: "#edff70"});
        this.moneyText.setShadow(2, 2, 'rgba(0,0,0,0.5)', 2);
        this.bar.drawRect(0, 20, 150, 100);
        this.bar.fixedToCamera = true;
        this.moneyText.fixedToCamera = true;

        this.scoreText = this.game.add.text(30, 60, score + " %" + " ", {font: "bold 19px Arial", fill: "#edff70"});
        this.scoreText.setShadow(2, 2, 'rgba(0,0,0,0.5)', 2);
        this.scoreText.fixedToCamera = true;

        this.timeText = this.game.add.text(30, 90, timePlayedMin + ":" + ('0' + timePlayedSec).slice(-2) + " min" + " ", {font: "bold 19px Arial", fill: "#edff70"});
        this.timeText.setShadow(2, 2, 'rgba(0,0,0,0.5)', 2);
        this.timeText.fixedToCamera = true;

        // there may be houses in reach of the base tower
        let revenue = this.calculateInitialHouseRevenue();
        this.updateMoney(revenue);
        this.calculateCoverage();
    },

    update: function () {
        // Moving with Keys
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

        // Move with mouse at screen edges
        if (this.game.input.activePointer.position.x < (viewport.w * 0.25)) {
            this.game.camera.x -= Phaser.Math.mapLinear(
                this.game.input.activePointer.position.x,
                0,
                viewport.w * 0.25,
                15,
                1
            );
        } else if (this.game.input.activePointer.position.x > (viewport.w * 0.75)) {
            this.game.camera.x += Phaser.Math.mapLinear(
                this.game.input.activePointer.position.x,
                viewport.w,
                viewport.w * 0.75,
                15,
                1
            );
        }

        if (this.game.input.activePointer.position.y < (viewport.h * 0.25)) {
            this.game.camera.y -= Phaser.Math.mapLinear(
                this.game.input.activePointer.position.y,
                0,
                viewport.h * 0.25,
                15,
                1
            );
        } else if (this.game.input.activePointer.position.y > (viewport.h * 0.75)) {
            this.game.camera.y += Phaser.Math.mapLinear(
                this.game.input.activePointer.position.y,
                viewport.h,
                viewport.h * 0.75,
                15,
                1
            );
        }

        // Drag&Drop
        if (this.game.input.activePointer.isDown) {
            if (this.game.origDragPoint) {
                this.game.camera.x += this.game.origDragPoint.x - this.game.input.activePointer.position.x;
                this.game.camera.y += this.game.origDragPoint.y - this.game.input.activePointer.position.y;
            }
            this.game.origDragPoint = this.game.input.activePointer.position.clone();
        } else {
            this.game.origDragPoint = null;
        }

        // Build Tower
        this.game.input.onTap.addOnce(this.buildTower, this);

        // Update minimap
        let miniMapViewportX = this.game.camera.x * 150 / this.game.world.width;
        let miniMapViewportY = this.game.camera.y * 150 / this.game.world.height;
        let miniMapViewportWidth = this.camera.width / this.game.world.width * 150;
        let miniMapViewportHeight = this.camera.height / this.game.world.height * 150;

        this.miniMap.rect(0, 0, this.miniMap.width, this.miniMap.height, '#000000');
        this.miniMap.rect(2 + miniMapViewportX, 2 + miniMapViewportY, miniMapViewportWidth, miniMapViewportHeight, '#ffffff');
        this.miniMap.update();

        // Let the world live!
        this.animateWorld();

        // Pay the rent
        this.periodicBilling();
        if (money < 0) {
            money = startMoney;
            this.game.state.start('gameOver');
        }

        // Update the marker position
        let x = this.game.tilelayer.getTileX(this.game.input.activePointer.worldX);
        let y = this.game.tilelayer.getTileY(this.game.input.activePointer.worldY);

        this.marker.x = x * cellSize;
        this.marker.y = y * cellSize;

        // Update the marker color
        let currentTile = this.game.map.getCell(x, y);
        if (currentTile.isBlocked()) {
            this.marker.lineStyle(2, 0xff0000, 1);
        } else if (currentTile.covered === false) {
            this.marker.lineStyle(2, 0xffff00, 1);
        } else {
            this.marker.lineStyle(2, 0x00ff00, 1);
        }

        // Update playTime
        let timePlayedRaw = (this.game.time.totalElapsedSeconds() / 60.0) - timeGameStartedAt;
        let timePlayedMin = Math.floor(timePlayedRaw);
        let timePlayedSec = timePlayedRaw * 60 % 60;
        timePlayedSec = Math.floor(timePlayedSec);
        this.timeText.setText(timePlayedMin + ":" + ('0' + timePlayedSec).slice(-2) + " min" + " ");
    },

    render: function () {
        // Prepare the rendering
        this.graphics.clear();
        this.graphics.beginFill(0x000FF0, 0.2);
        let now = this.game.time.now;
        for (let t in this.texts) {
            if (t.birth - now <= 100) {
                this.game.text.remove(t);
            }
        }

        // Render the map
        for (let x = 0; x < this.game.map.width; x++) {
            for (let y = 0; y < this.game.map.height; y++) {
                let cell = this.game.map.getCell(x, y);
                if (cell.covered) {
                    this.graphics.drawRoundedRect(cellSize * x, cellSize * y, cellSize, cellSize, 0.4);
                }
            }
        }

        // Now flush the graphics
        this.graphics.endFill();
        // draw marker on very top
        this.marker.drawRect(0, 0, cellSize, cellSize);
    },

    shutdown: function () {
        this.gameAudio.stop();
        this.graphics.clear();
        this.miniMap.destroy();
    },

    buildTower: function () {
        let x = this.game.tilelayer.getTileX(this.game.input.activePointer.worldX);
        let y = this.game.tilelayer.getTileY(this.game.input.activePointer.worldY);
        let currentTile = this.game.map.getCell(x, y);

        if (currentTile.isEmpty() && !currentTile.isBlocked()) {
            this.game.map.buildTower(x, y);
            this.updateMoney(towerInitialCost, false);
            this.game.tilemap.putTile(1, x, y);
            this.moneyEffect(x, y, towerInitialCost);
            if (currentTile.covered) {
                this.game.map.coverAt(x, y);
                this.game.map.updateCoverage(this.game.map.towers.length - 1);
            }
            let revenue = this.calculateInitialHouseRevenue();
            this.updateMoney(revenue);

            this.calculateCoverage();

            this.flashBuildSuccess();
        } else {
            this.flashBuildFails();
        }
    },

    getBaseTower: function () {
        for (let i = 0; i < this.game.map.towers.length; i++) {
            let tower = this.game.map.towers[i];
            let cell = this.game.map.getCell(tower.x, tower.y);
            if (cell.isBaseTower()) {
                return {x: tower.x, y: tower.y};
            }
        }
    },

    periodicBilling: function () {
        let timeNow = this.game.time.now;
        if ((timeNow - this.lastBillingRun) > (billingIntervalSeconds * 1000)) {
            this.lastBillingRun = timeNow;

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

    calculateInitialHouseRevenue: function () {
        let revenue = 0;
        for (let x = 0; x < this.game.map.width; x++) {
            for (let y = 0; y < this.game.map.height; y++) {
                let cell = this.game.map.getCell(x, y);
                if (cell.isHouse() && cell.covered && !cell.paidFor) {
                    revenue += houseInitialRevenue;
                    cell.paidFor = true;
                    this.moneyEffect(x, y, houseInitialRevenue);
                }
            }
        }

        return revenue;
    },

    updateMoney: function (value, playsound = true) {
        if (playsound) {
            if (value >= 0) {
                this.cashGood.play();
            } else {
                this.cashBad.play();
            }
        }
        money += value;
        this.moneyText.setText("$ " + money + " ");
    },

    animateWorld: function () {
        // Let the Birds fly
        for (let i = 0; i < this.game.birds.length; i++) {
            let aktbird = this.game.birds[i];
            if (aktbird.angle === 0) {
                aktbird.y -= birdSpeed;
            } else if (aktbird.angle === 90) {
                aktbird.x += birdSpeed;
            } else if (aktbird.angle === 180 || aktbird.angle === -180) {
                aktbird.y += birdSpeed;
            } else if (aktbird.angle === -90) {
                aktbird.x -= birdSpeed;
            }

            // Change rotation sometimes
            if (Math.random() > 0.99) {
                if (Math.random() > 0.5) {
                    aktbird.angle += 90;
                } else {
                    aktbird.angle -= 90;
                }
            }

            // Rotate them when at the end of map
            if (aktbird.x < 0) {
                aktbird.angle = 90;
            } else if (aktbird.x > this.game.world.width) {
                aktbird.angle = -90;
            }
            if (aktbird.y < 0) {
                aktbird.angle = 180;
            } else if (aktbird.y > this.game.world.height) {
                aktbird.angle = 0;
            }
        }
    },

    flashBuildSuccess: function () {
        this.game.camera.flash(this.colorBuild, 200);
    },

    flashBuildFails: function () {
        this.game.camera.flash(this.colorFail, 200);
    },

    moneyEffect: function (x, y, value) {
        let fontConfig = {antialias: false, font: "bold 16pt Arial"};
        if (value >= 0) {
            // color green
            fontConfig.fill = "#00ff00";
        } else {
            // color red
            fontConfig.fill = "#ff0000";
        }
        let effectX = (x * cellSize) + (cellSize / 4);
        let effectY = (y * cellSize) + (cellSize / 2);
        let text = this.game.add.text(effectX, effectY, "$ " + value + " ", fontConfig);
        text.setShadow(2, 2, 'rgba(0,0,0,0.5)', 2);
        text.birth = this.game.time.now;

        this.texts.push(text);

        this.game.add.tween(text).to({alpha: 0}, 1000, Phaser.Easing.Default, true, 1000);
    },

    calculateCoverage: function () {
        let countCoveredHouses = 0;
        for (let i = 0; i < this.game.map.houses.length; i++) {
            let houses = this.game.map.houses[i];
            let cell = this.game.map.getCell(houses.x, houses.y);
            if (cell.isHouse() && cell.paidFor) {
                countCoveredHouses++;
            }
        }

        score = 100 / this.game.map.houses.length * countCoveredHouses;
        this.scoreText.setText(score + " % ");

        if (countCoveredHouses === this.game.map.houses.length) {
            this.game.state.start('gameOver');
        }
    },
};
