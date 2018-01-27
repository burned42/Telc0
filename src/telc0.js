//global game settings (letiables)
let game;
let cellSize = 124;
let mapRows;
let mapCols;

let moneytext;
let lastmaintenance;
let timenow;
let cursors;

// TODO change values
let money = 2000;
let towercost = -1000;
let revenue = 50 * 22;
let maintenanceinterval = 10 * 1000;
let maintenancecost = -100;

//main game functions for each game step
window.onload = function () {
    let creditsHeight = document.getElementById('credits').scrollHeight;
    let containerHeight = document.getElementById('container').scrollHeight;

    let maxHeight = containerHeight - creditsHeight;
    let maxWidth = document.getElementById('container').scrollWidth;

    mapRows = Math.floor(maxWidth / cellSize);
    mapCols = Math.floor(maxHeight / cellSize);

    let game = new Phaser.Game(mapCols * cellSize, mapRows * cellSize, Phaser.CANVAS, 'game');
    game.state.add('boot', gameBoot);
    game.state.add('preload', gamePreload);
    game.state.add('menu', gameMenu);
    game.state.add('telc0', runningGame);
    //add state Pause here
    game.state.add('gameOver', gameOver);
    game.state.start('boot');
};

