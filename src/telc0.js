//global game settings (letiables)
let game;
let cellSize = 128;
let mapRows = 32;
let mapCols = 32;

let moneytext;
let lastmaintenance;
let timenow;

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

    let game = new Phaser.Game(800, 600, Phaser.CANVAS, 'game');
    game.state.add('boot', gameBoot);
    game.state.add('preload', gamePreload);
    game.state.add('menu', gameMenu);
    game.state.add('telc0', runningGame);
    //add state Pause here
    game.state.add('gameOver', gameOver);
    game.state.start('boot');
};

