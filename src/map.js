function Map(width, height, houseCount) {
    this.width = width;
    this.height = height;
    this.houseCount = houseCount;
    this.map = [];
    this.generateMap();

    this.getMap = function () {
        return this.map;
    };
}

Map.prototype.generateMap = function () {
    // initialize empty map
    for (var i = 0; i < this.height; i++) {
        this.map[i] = [];
        for (var j = 0; j < this.width; j++) {
            this.map[i][j] = '';
        }
    }

    // spawn tower
    var x = getRandomInt(0, this.width);
    var y = getRandomInt(0, this.height);
    this.map[y][x] = 'T';

    // spawn houses
    for (var h = 0; h < this.houseCount; h++) {
        do {
            x = getRandomInt(0, this.width);
            y = getRandomInt(0, this.height);
        } while (this.map[y][x] !== '');

        this.map[y][x] = 'H';
    }
};

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}
