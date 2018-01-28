function Map(width, height, houseCount, natureCount) {
    this.connecetTowers = [];
    this.width = width;
    this.height = height;
    this.houseCount = houseCount;
    this.natureCount = natureCount;
    this.map = [];
    this.towers = [];
    this.houses = [];
    this.covered = [];

    this.generateMap();
}

Map.prototype.generateMap = function () {
    // initialize empty map
    for (let y = 0; y < this.height; y++) {
        this.map[y] = [];
        for (let x = 0; x < this.width; x++) {
            this.setEmpty(x, y);
        }
    }

    // spawn tower
    let baseTowerX = getRandomInt(0, this.width);
    let baseTowerY = getRandomInt(0, this.height);
    this.buildBaseTower(baseTowerX, baseTowerY);

    // Four simple Streets
    for (let i = 1; i <= numofroads; i++) {
        let x = getRandomInt(0, this.width);
        let y = getRandomInt(0, this.height);
        if (this.getCell(x, y).isEmpty() &&
            (x - 1 >= 1 && !this.getCell(x - 1, y).isStreet()) &&
            (x + 1 <= this.width - 1 && !this.getCell(x + 1, y).isStreet()) &&
            (y - 1 >= 1 && !this.getCell(x, y - 1).isStreet()) &&
            (y + 1 <= this.height - 1 && !this.getCell(x, y + 1).isStreet())) {
            this.buildStreet(x, y, 8);

            // Up
            this.buildStreetLine(x, y, 1);

            // Right
            this.buildStreetLine(x, y, 2);

            // Down
            this.buildStreetLine(x, y, 3);

            // Left
            this.buildStreetLine(x, y, 4);
        } else {
            i--;
        }
    }

    // spawn houses
    for (let i = 0; i < this.houseCount; i++) {
        let j = 0;
        let x, y;
        do {
            x = getRandomInt(0, this.width);
            y = getRandomInt(0, this.height);
            j++;
        } while (j < 1000 && this.getCell(x, y).isEmpty() === false);

        if (this.getCell(x, y).isEmpty()) {
            this.buildHouse(x, y);
        }
    }

    // spawn random nature tiles
    for (let i = 0; i < this.natureCount; i++) {
        let j = 0;
        let x, y;
        do {
            x = getRandomInt(0, this.width);
            y = getRandomInt(0, this.height);
            j++;
        } while (j < 1000 && this.getCell(x, y).isEmpty() === false);

        if (this.getCell(x, y).isEmpty()) {
            this.buildNature(x, y);
        }
    }

    this.coverAt(baseTowerX, baseTowerY);
};

Map.prototype.getTowerCount = function () {
    let count = 0;
    for (let y = 0; y < this.height; y++) {
        for (let x = 0; x < this.width; x++) {
            if (this.getCell(x, y).isTower()) {
                count++;
            }
        }
    }

    return count;
};

Map.prototype.getCell = function (x, y) {
    return this.map[y][x];
};

Map.prototype.setEmpty = function (x, y) {
    this.map[y][x] = new EmptyCell();
};

Map.prototype.buildTower = function (x, y) {
    let tower = new TowerCell();
    tower.posX = x;
    tower.posY = y;
    this.map[y][x] = tower;
    this.towers.push({x:x, y:y})
};

Map.prototype.buildBaseTower = function (x, y) {
    let tower = new BaseTowerCell();
    this.map[y][x] = tower;
    this.towers.push({x:x, y:y});
};

Map.prototype.buildStreet = function (x, y, streettype) {
    this.map[y][x] = new StreetCell(streettype);
};

Map.prototype.buildStreetLine = function (x, y, direction) {
    let i = 0;
    while (i < 1000) {
        if (x >= this.width - 1 || y >= this.height - 1 || x <= 0 || y <= 0) {
            return;
        }

        let streettype = 8;
        if (direction === 1) {
            y -= 1;
            if (!this.getCell(x, y).isStreet()) {
                if (getRandomInt(0, 6) === 5) {
                    streettype = 13;
                } else {
                    streettype = 6;
                }
            }
        }
        if (direction === 2) {
            x += 1;
            if (!this.getCell(x, y).isStreet()) {
                if (getRandomInt(0, 6) === 5) {
                    streettype = 12;
                } else {
                    streettype = 7;
                }
            }
        }
        if (direction === 3) {
            y += 1;
            if (!this.getCell(x, y).isStreet()) {
                if (getRandomInt(0, 6) === 5) {
                    streettype = 13;
                } else {
                    streettype = 6;
                }
            }
        }
        if (direction === 4) {
            x -= 1;
            if (!this.getCell(x, y).isStreet()) {
                if (getRandomInt(0, 6) === 5) {
                    streettype = 12;
                } else {
                    streettype = 7;
                }
            }
        }

        if (this.getCell(x, y).isEmpty() === false && this.getCell(x, y).isStreet() === false) {
            return;
        }

        this.map[y][x] = new StreetCell(streettype);

        i++;
    }
};

Map.prototype.buildHouse = function (x, y) {
    this.map[y][x] = new HouseCell();
    this.houses.push({x: x, y: y});
};

Map.prototype.buildNature = function (x, y) {
    this.map[y][x] = new NatureCell();
};

Map.prototype.getMapAsCsv = function () {
    let csv = "";
    let line = "";
    for (let y = 0; y < this.height; y++) {
        line = "";
        for (let x = 0; x < this.width; x++) {
            let cell = this.getCell(x, y);
            if (line === "") {
                line = cell.getTilemapId();
            }
            else {
                line = line + "," + cell.getTilemapId();
            }
        }
        csv = csv + line + "\n";
    }

    return csv;
};

Map.prototype.coverAt = function (x, y) {
    this.getCell(x, y).covered = true;
    for (let i = x - coverRadius; i <= x + coverRadius; i++) {
        if (i >= 0 && i < this.width) {
            for (let j = y - coverRadius; j <= y + coverRadius; j++) {
                if (j >= 0 && j < this.height) {
                    this.getCell(i, j).covered = true;
                    this.covered.push({x: i, y: j});
                }
            }
        }
    }
};

Map.prototype.getMapAsCsv = function () {
    let csv = "";
    let line = "";
    for (let y = 0; y < this.height; y++) {
        line = "";
        for (let x = 0; x < this.width; x++) {
            let cell = this.getCell(x, y);
            if (line === "") {
                line = cell.getTilemapId();
            }
            else {
                line = line + "," + cell.getTilemapId();
            }
        }
        csv = csv + line + "\n";
    }

    return csv;
};

Map.prototype.isConnectedToNetwork = function (x, y) {
    return this.getCell(x,y).covered;
};

Map.prototype.updateCoverage = function (input) {
    if (input < 0 || input>=this.towers.length){
        return
    }
    let t = this.towers[input];
    if (t === null){
        return this.updateCoverage(input-1);
    }
    for (let i = t.x - coverRadius; i <= t.x + coverRadius; i++) {
        if (i >= 0 && i < this.width) {
            for (let j = t.y - coverRadius; j <= t.y + coverRadius; j++) {
                if (j >= 0 && j < this.height) {
                    //if something in our reach is a connected tower, cover at our position (connect US)
                    let cell = this.getCell(i,j);
                    if (this.isConnectedToNetwork(i, j) && cell.isTower()){
                        this.coverAt(i, j);
                        this.coverAt(t.x, t.y);
                        return this.updateCoverage(input-1);
                    }
                }
            }
        }
    }
    // return ;
    return this.updateCoverage(input-1);
};


function Cell() {
    this.empty = [0, 4, 9];
    this.tower = [1, 10];
    this.house = [2, 5];
    this.nature = [3, 11];
    this.street = [6, 7, 8, 12, 13];
    this.covered = false;
    this.type = null;

    this.getTilemapId = function () {
        return this.type;
    };

    this.isEmpty = function () {
        return this.empty.includes(this.type);
    };

    this.isTower = function () {
        return this.tower.includes(this.type);
    };

    this.isBaseTower = function () {
        return this.type === 10;
    };

    this.isHouse = function () {
        return this.house.includes(this.type);
    };

    this.isBlocked = function () {
        return (
            this.tower.includes(this.type)
            || this.house.includes(this.type)
            || this.nature.includes(this.type)
            || this.street.includes(this.type)
        );
    };

    this.isStreet = function () {
        return this.street.includes(this.type);
    };

    this.isRabbit = function () {
        return this.type === 4;
    };

    this.isDuck = function () {
        return this.type === 3;
    }
}

function EmptyCell() {
    Cell.call(this);

    let emptyTiles = this.empty;
    // add some more empty grass
    emptyTiles.push(0, 0, 0);
    this.type = emptyTiles[Math.floor(Math.random() * emptyTiles.length)]
}

function HouseCell() {
    Cell.call(this);

    let houseTiles = this.house;
    this.type = houseTiles[Math.floor(Math.random() * houseTiles.length)];

    this.paidFor = false;
}

function TowerCell() {
    Cell.call(this);
    this.posX = null;
    this.posY = null;
    this.type = 1;
}

function StreetCell(streettype) {
    Cell.call(this);

    this.type = streettype;
}

function BaseTowerCell() {
    TowerCell.call(this);

    this.type = 10;
}

function NatureCell() {
    Cell.call(this);

    let natureTiles = this.nature;
    this.type = natureTiles[Math.floor(Math.random() * natureTiles.length)];
}
