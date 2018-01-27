function Map(width, height, houseCount) {
    this.width = width;
    this.height = height;
    this.houseCount = houseCount;
    this.map = [];

    this.generateMap();
}

Map.prototype.generateMap = function () {
    // initialize empty map
    for (let i = 0; i < this.height; i++) {
        this.map[i] = [];
        for (let j = 0; j < this.width; j++) {
            this.map[i][j] = new EmptyCell();
        }
    }

    // spawn tower
    let x = getRandomInt(0, this.width);
    let y = getRandomInt(0, this.height);
    this.map[y][x] = new TowerCell();

    // spawn houses
    for (let h = 0; h < this.houseCount; h++) {
        do {
            x = getRandomInt(0, this.width);
            y = getRandomInt(0, this.height);
        } while (this.map[y][x].isHouse() || this.map[y][x].isTower());

        this.map[y][x] = new HouseCell();
    }
};

Map.prototype.getMapAsCsv = function () {
    let csv = "";
    let line = "";
    for (let i = 0; i < this.height; i++) {
        line = "";
        for (let j = 0; j < this.width; j++) {
            let cell = this.getCell(j, i);
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
    for (let i = 0; i < this.height; i++) {
        for (let j = 0; j < this.width; j++) {
            if (this.map[i][j].isTower()) {
                count++;
            }
        }
    }

    return count;
};

Map.prototype.getCell = function (x, y) {
    return this.map[y][x];
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
