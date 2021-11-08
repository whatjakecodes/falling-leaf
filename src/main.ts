import { initializeBrickWalls } from "./walls";
import { initializeLeaf } from "./leaf";
import { getApp } from "./app";
import * as PIXI from "pixi.js";

const app = getApp();

initializeLeaf(app);

initializeBrickWalls(app);

// @ts-ignore
// get pixi dev tools working
window.PIXI = PIXI;