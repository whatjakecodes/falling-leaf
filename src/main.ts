import {getApp} from "./app";
import {startGame} from "./menu";
import * as PIXI from "pixi.js";

const app = getApp();

startGame(app);

// @ts-ignore
// get pixi dev tools working
window.PIXI = PIXI;