import * as PIXI from "pixi.js";
import {initializeBrickWalls, restartBrickWalls} from "./gameplay/walls";
import {initializeLeaf, restartLeaf} from "./gameplay/leaf";

const START_KEYS = ["Enter"];
let globalApp: PIXI.Application;

export function startGame(app: PIXI.Application) {
    globalApp = app;
    const startText = new PIXI.Text('Press "Enter" to start', {
        fill: 'white',
    })
    startText.anchor.set(0.5)
    startText.x = app.screen.width / 2
    startText.y = app.screen.height / 2

    document.addEventListener('keyup', initializeGame)
    app.stage.addChild(startText)

    function initializeGame(key: KeyboardEvent) {
        if (START_KEYS.indexOf(key.code) === -1) return
        initializeLeaf(app)
        initializeBrickWalls(app)
        app.stage.removeChild(startText)
        document.removeEventListener('keyup', initializeGame)
    }
}

export function showRestart(previousScore: number) {
    const message = 'Score: ' + previousScore + '\nPress "Enter" to try again'
    const restartText = new PIXI.Text(message, {
        fill: 'white',
    })
    restartText.anchor.set(0.5)
    restartText.x = globalApp.screen.width / 2
    restartText.y = globalApp.screen.height / 2

    globalApp.stage.addChild(restartText)

    // todo: wait for 1 keyup before restarting game, for players who hold the left/right keys down when collision occurs
    document.addEventListener('keyup', restartGame)

    function restartGame(key: KeyboardEvent) {
        if (START_KEYS.indexOf(key.code) === -1) return

        restartLeaf(globalApp)
        restartBrickWalls(globalApp)
        globalApp.stage.removeChild(restartText)
        document.removeEventListener('keyup', restartGame)
    }
}