import * as PIXI from "pixi.js";
import {initializeBrickWalls, restartBrickWalls, stopWalls} from "./gameplay/walls";
import {initializeLeaf, restartLeaf, stopLeaf} from "./gameplay/leaf";

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

    document.addEventListener('keydown', (key: KeyboardEvent) => {
        if (START_KEYS.indexOf(key.code) === -1) return

        initializeLeaf(app)
        initializeBrickWalls(app)
        app.stage.removeChild(startText)
    }, {once: true})

    app.stage.addChild(startText)
}

export function endGame() {
    stopLeaf();
    stopWalls();
    showRestart()
}

function showRestart() {
    const restartText = new PIXI.Text('Press A,D,<-,-> to try again', {
        fill: 'white',
    })
    restartText.anchor.set(0.5)
    restartText.x = globalApp.screen.width / 2
    restartText.y = globalApp.screen.height / 2
    globalApp.stage.addChild(restartText)

    document.addEventListener('keydown', (key: KeyboardEvent) => {
        if (START_KEYS.indexOf(key.code) === -1) return

        restartLeaf(globalApp)
        restartBrickWalls(globalApp)
        globalApp.stage.removeChild(restartText)
    }, {once: true})
}