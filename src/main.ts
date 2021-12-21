import {getApp} from "./app";
import {startGame} from "./menu";
import * as PIXI from "pixi.js";
import {Ticker} from "pixi.js";

const app = getApp();
startGame(app);

Ticker.shared.maxFPS = 60;

// @ts-ignore
// get pixi dev tools working
window.PIXI = PIXI;