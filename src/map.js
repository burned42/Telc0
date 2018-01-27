function Map(width, height, houseCount) {
    this.width = width;
    this.height = height;
    this.houseCount = houseCount;
    this.map = [];

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
    this.buildTower(x, y);

    // spawn houses
    for (let i = 0; i < this.houseCount; i++) {
        let j = 0;
        do {
            x = getRandomInt(0, this.width);
            y = getRandomInt(0, this.height);
            j++;
        } while (
            j < 1000
            && (this.getCell(x, y).isHouse() || this.getCell(x, y).isTower())
        );

        this.buildHouse(x, y);
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
};

Map.prototype.buildHouse = function (x, y) {
    this.map[y][x] = new HouseCell();
};

function Cell() {
    this.empty = 0;
    this.tower = 1;
    this.house = 2;

    this.type = null;

    this.getTilemapId = function () {
        return this.type;
    };

    this.isEmpty = function () {
        return this.type === this.empty;
    };

    this.isTower = function () {
        return this.type === this.tower;
    };

    this.isHouse = function () {
        return this.type === this.house;
    };
}

function EmptyCell() {
    Cell.call(this);

    this.type = this.empty;
}

function HouseCell() {
    Cell.call(this);

    this.type = this.house;
}

function TowerCell() {
    Cell.call(this);

    this.type = this.tower;
}
