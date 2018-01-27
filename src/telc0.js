//global game settings (letiables)
let game;
let cellSize = 128;
let mapRows = 32;
let mapCols = 32;
let viewport = {w: 800, h: 600};

let maxHeight = mapRows * cellSize; //document.getElementById('container').scrollHeight;
let maxWidth = mapCols * cellSize; //document.getElementById('container').scrollWidth;
let mapHeight = Math.floor(maxHeight);
let mapWidth = Math.floor(maxWidth);

let birdspeed = 2;
let numofbirds = 6;

let moneytext;
let bar;
let lastmaintenance;
let timenow;

// TODO change values
let startMoney = 1000;
let money = startMoney;
let towercost = -200;
let revenueHouse = 50;
let maintenanceinterval = 10 * 1000; // secends * milliseconds
let maintenancecost = -100;

//main game functions for each game step
window.onload = function () {
    game = new Phaser.Game(800, 600, Phaser.CANVAS, 'game', null, false, false, null);
    game.state.add('boot', gameBoot);
    game.state.add('preload', gamePreload);
    game.state.add('menu', gameMenu);
    game.state.add('telc0', runningGame);
    game.state.add('gameOver', gameOver);
    game.state.start('boot');
};
