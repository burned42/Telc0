//global game settings (letiables)
let game;
let cellSize = 128;
let mapRows = 16;
let mapCols = 16;

let moneytext;
let bar;
let lastmaintenance;
let timenow;

// TODO change values
let money = 1000;
let towercost = -200;
let revenueHouse = 50;
let maintenanceinterval = 10 * 1000;
let maintenancecost = -100;

//main game functions for each game step
window.onload = function () {
    let maxHeight = document.getElementById('container').scrollHeight;
    let maxWidth = document.getElementById('container').scrollWidth;
    let mapHeight = Math.floor(maxHeight / mapCols);
    let mapWidth = Math.floor(maxWidth / mapRows);
    let game = new Phaser.Game(maxWidth, maxHeight, Phaser.CANVAS, 'game', null, false, false, null);
    game.state.add('boot', gameBoot);
    game.state.add('preload', gamePreload);
    game.state.add('menu', gameMenu);
    game.state.add('telc0', runningGame);
    game.state.add('gameOver', gameOver);
    game.state.start('boot');
};

