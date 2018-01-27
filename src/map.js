function Map(width, height, houseCount, blockedCount) {
    this.width = width;
    this.height = height;
    this.houseCount = houseCount;
    this.blockedCount = blockedCount;
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
    let x = getRandomInt(0, this.width);
    let y = getRandomInt(0, this.height);
    this.buildBaseTower(x, y);

    // Four simple Streets
    for (let i = 1; i <= numofroads; i++) {
        x = getRandomInt(0, this.width);
        y = getRandomInt(0, this.height);
        if (this.getCell(x, y).isEmpty() && 
            (x-1 >= 1 && !this.getCell(x-1, y).isStreet()) &&
            (x+1 <= this.width-1 && !this.getCell(x+1, y).isStreet()) &&
            (y-1 >= 1 && !this.getCell(x, y-1).isStreet()) &&
            (y+1 <= this.height-1 && !this.getCell(x, y+1).isStreet())) {
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
        do {
            x = getRandomInt(0, this.width);
            y = getRandomInt(0, this.height);
            j++;
        } while (j < 1000 && this.getCell(x, y).isEmpty() === false);

        if (this.getCell(x, y).isEmpty()) {
            this.buildHouse(x, y);
        }
    }

    // spawn random blocked tiles
    for (let i = 0; i < this.blockedCount; i++) {
        let j = 0;
        do {
            x = getRandomInt(0, this.width);
            y = getRandomInt(0, this.height);
            j++;
        } while (j < 1000 && this.getCell(x, y).isEmpty());

        if (this.getCell(x, y).isEmpty()) {
            this.buildBlocked(x, y);
        }
    }
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
    this.map[y][x] = new TowerCell();
    this.towers.push({x:x, y:y})
};

Map.prototype.buildBaseTower = function (x, y) {
    this.map[y][x] = new BaseTowerCell();
    this.towers.push({x:x, y:y})
};

Map.prototype.buildStreet = function (x, y, streettype) {
    this.map[y][x] = new StreetCell(streettype);
};

Map.prototype.buildStreetLine = function (x, y, direction) {
    let i = 0;
    while (i < 1000) {
        if (x >= this.width-1 || y >= this.height-1 || x <= 0 || y <= 0) {
            return;
        }

        let streettype = 8;
        if (direction === 1) {
            y -= 1;
            if (!this.getCell(x, y).isStreet()) {
                streettype = 6;
            }
        }
        if (direction === 2) {
            x += 1;
            if (!this.getCell(x, y).isStreet()) {
                streettype = 7;
            }
        }
        if (direction === 3) {
            y += 1;
            if (!this.getCell(x, y).isStreet()) {
                streettype = 6;
            }
        }
        if (direction === 4) {
            x -= 1;
            if (!this.getCell(x, y).isStreet()) {
                streettype = 7;
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

Map.prototype.buildBlocked = function (x, y) {
    this.map[y][x] = new BlockCell();
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
    for (let i = x - 1; i <= x + 1; i++) {
        if (i >= 0 && i < this.width) {
            for (let j = y - 1; j <= y + 1; j++) {
                if (j >= 0 && j < this.height) {
                    this.getCell(i, j).covered = true;
                    this.covered.push({x:i, y: j});
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
    for (let i = x - 1; i <= x + 1; i++) {
        if (i >= 0 && i < this.width) {
            for (let j = y - 1; j <= y + 1; j++) {
                if (j >= 0 && j < this.height) {
                    if(this.getCell(i, j).covered){
                        return true;
                    }
                }
            }
        }
    }
};


function Cell() {
    this.empty = [0, 4, 9];
    this.tower = [1, 10];
    this.house = [2, 5];
    this.blocked = [3, 6, 7, 8, 11];
    this.street = [6, 7, 8];
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
        return this.blocked.includes(this.type);
    };

    this.isStreet = function () {
        return this.street.includes(this.type);
    };
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

function BlockCell() {
    Cell.call(this);

    do {
        this.type = this.blocked[getRandomInt(0, this.blocked.length)];
    } while (this.street.includes(this.type));
}
