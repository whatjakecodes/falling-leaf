import * as PIXI from "pixi.js";
import {getScore, initializeBrickWalls, restartBrickWalls, stopWalls} from "./gameplay/walls";
import {initializeLeaf, restartLeaf, stopLeaf} from "./gameplay/leaf";
import {Ticker} from "pixi.js";

const START_KEYS = ["KeyA", "KeyD", "ArrowLeft", "ArrowRight"];
let globalApp: PIXI.Application;

export function startGame(app: PIXI.Application) {
    globalApp = app;
    const startText = new PIXI.Text('Press A,D,<-,-> to start', {
        fill: 'white',
    })
    startText.anchor.set(0.5)
    startText.x = app.screen.width / 2
    startText.y = app.screen.height / 2

    Ticker.shared.maxFPS = 60;
    document.addEventListener('keydown', initializeGame, {once: true})
    app.stage.addChild(startText)

    function initializeGame(key: KeyboardEvent) {
        if (START_KEYS.indexOf(key.code) === -1) return
        initializeLeaf(app)
        initializeBrickWalls(app)
        app.stage.removeChild(startText)
    }
}

export function endGame() {
    stopLeaf();
    stopWalls();
    showRestart(getScore())
}

function showRestart(previousScore: number) {
    const message = 'Score: ' + previousScore + '\nPress A,D,<-,-> to try again'
    const restartText = new PIXI.Text(message, {
        fill: 'white',
    })
    restartText.anchor.set(0.5)
    restartText.x = globalApp.screen.width / 2
    restartText.y = globalApp.screen.height / 2

    globalApp.stage.addChild(restartText)

    // todo: wait for 1 keyup before restarting game, for players who hold the left/right keys down when collision occurs
    document.addEventListener('keydown', restartGame, {once: true})

    function restartGame(key: KeyboardEvent) {
        if (START_KEYS.indexOf(key.code) === -1) return

        restartLeaf(globalApp)
        restartBrickWalls(globalApp)
        globalApp.stage.removeChild(restartText)
    }
}