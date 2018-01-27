let runningGame = function () {
    // do something…

    this.cursors = null;
    this.cashGood = null;
    this.cashBad = null;
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


        let start = this.findFirstTower();
        this.game.camera.x = start.x * 128;
        this.game.camera.y = start.y * 128;

        this.cursors = this.game.input.keyboard.createCursorKeys();

        let bar = this.game.add.graphics();
        bar.beginFill(0x000000, 0.2);
        bar.drawRect(0, 20, 150, 40);
        moneytext = this.game.add.text(30, 30, "$ " + money, {font: "bold 19px Arial", fill: "#edff70"});
        bar.fixedToCamera = true;
        moneytext.fixedToCamera = true;

        this.cashGood = this.game.add.audio('cashGood');
        this.cashBad = this.game.add.audio('cashBad');

        this.game.add.audio('backgroundTheme', 1, true).play();

        lastmaintenance = this.game.time.now;
    },

    update: function () {
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

        timenow = this.game.time.now;
        if (timenow - lastmaintenance > maintenanceinterval) {
            lastmaintenance = this.game.time.now;
            this.update_money(maintenancecost * this.game.map.getTowerCount())
        }
        if (money < towercost) {
            // TODO End the this.game
        }
        this.game.input.onDown.addOnce(this.build_tower, this);
    },

    render: function() {
        // this.game.debug.cameraInfo(this.game.camera, 32, 32);
    },

    build_tower: function () {
        let x = this.game.tilelayer.getTileX(this.game.input.activePointer.worldX);
        let y = this.game.tilelayer.getTileY(this.game.input.activePointer.worldY);
        let current_tile = this.game.map.getCell(x, y);

        if (current_tile.isEmpty()) {
            this.game.map.buildTower(x, y);
            this.update_money(towercost, false);
            this.game.tilemap.putTile(1, x, y);
            let revenue = this.calculate_revenue();
            this.update_money(revenue);
        }
    },

    findFirstTower: function () {
        for (let i =0; i < this.game.map.width; i++){
            for (let j = 0; j < this.game.map.height; j++){
                let cell = this.game.map.getCell(i, j);
                console.log(cell.covered);
                if (cell.isTower() === true){
                    return {x: i, y: j};
                }
            }
        }
    },

    calculate_revenue: function() {
        let revenue = 0;
        for (let x = 0; x < this.game.map.width; x++) {
            for (let y = 0; x < this.game.map.height; y++) {
                let cell = this.game.map.getCell(x, y);
                if (cell.isHouse() && cell.covered && ! cell.paidFor) {
                    revenue += this.revenueHouse;
                    cell.paidFor = true;
                }
            }
        }
        return revenue
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
    }

};
