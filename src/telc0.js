//global game settings (letiables)
let game;
let cellSize = 128;
let mapRows = 32;
let mapCols = 32;
let maxHeight;
let maxWidth;
let mapHeight;
let mapWidth;
let viewport;

let coverRadius = 2; // note: real radius -1

let birdspeed = 2;
let numOfBirds = 20;

let numofroads = 5;

let bar;
let lastBillingRun;

let startMoney = 2000;
let money = startMoney;
let towerInitialCost = -400;
let towerMaintenanceCost = -100;
let houseInitialRevenue = 200;
let housePeriodicRevenue = 75;
let billingIntervalSeconds = 5;

let countCoveredHouses = 0;
let score;

//main game functions for each game step
window.onload = function () {
    maxHeight = document.getElementById('container').scrollHeight;
    maxWidth = document.getElementById('container').scrollWidth;
    mapHeight = Math.floor(maxHeight);
    mapWidth = Math.floor(maxWidth);

    viewport = {w: mapWidth, h: mapHeight};
    game = new Phaser.Game(viewport.w, viewport.h, Phaser.CANVAS, 'game', null, false, false, null);
    game.state.add('boot', gameBoot);
    game.state.add('preload', gamePreload);
    game.state.add('menu', gameMenu);
    game.state.add('telc0', runningGame);
    game.state.add('gameOver', gameOver);
    game.state.start('boot');
};
