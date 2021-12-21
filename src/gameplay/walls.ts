import {Application, Container, Sprite, Texture, Ticker} from "pixi.js";

import {bindDownwardVelocity, getLeafTopY} from "./leaf";
import {SpriteIntersect} from "../vendorTypes/yy-intersect";
import brickIconography from "../assets/bricks_smallllll.jpg";

const wallTexture = Texture.from(brickIconography);

let downwardVelocity = 0;
bindDownwardVelocity((v: number) => {
    downwardVelocity = v;
});

const wallsContainer = new Container();
let INITIAL_LEFT_WALL_Y: number;
let INITIAL_RIGHT_WALL_Y: number;
let leftHorizontalWall: Sprite;
let rightHorizontalWall: Sprite;
export const initializeBrickWalls = (app: Application) => {
    wallsContainer.x = app.screen.width / 2;
    wallsContainer.y = app.screen.height;

    leftHorizontalWall = createHorizontalWall(-app.screen.width, 0);
    rightHorizontalWall = createHorizontalWall(app.screen.width, app.screen.height);

    wallsContainer.addChild(leftHorizontalWall);
    wallsContainer.addChild(rightHorizontalWall);
    app.stage.addChild(wallsContainer);

    INITIAL_LEFT_WALL_Y = leftHorizontalWall.y;
    INITIAL_RIGHT_WALL_Y = rightHorizontalWall.y;

    endlessScroll(app, wallsContainer);
};

export const stopWalls = () => {
    if (wallTicker) wallTicker.stop();
}

let score = 0;
let isTopWallScored = false;
export const getScore = () => score;
export const restartBrickWalls = (app: Application) => {
    score = 0;
    isTopWallScored = false;
    wallsContainer.x = app.screen.width / 2;
    wallsContainer.y = app.screen.height;

    wallsContainer.removeChild(leftHorizontalWall)
    wallsContainer.removeChild(rightHorizontalWall)

    leftHorizontalWall.y = INITIAL_LEFT_WALL_Y;
    rightHorizontalWall.y = INITIAL_RIGHT_WALL_Y;

    wallsContainer.addChild(leftHorizontalWall)
    wallsContainer.addChild(rightHorizontalWall)

    wallTicker.start();
};

let wallTicker: Ticker;
function endlessScroll(app: Application, container: Container) {
    wallTicker = Ticker.shared.add(() => {
        container.y = container.y - downwardVelocity;

        const topWall = container.getChildAt(0) as SpriteIntersect;

        const leafTopY = getLeafTopY();
        const topWallBottomY = topWall.y + container.y;
        if (leafTopY > topWallBottomY && !isTopWallScored){
            isTopWallScored = true;
            score += 1;
        }

        if (wallIsAboveScreen(topWall)) {
            container.removeChild(topWall);
            moveWallBelowScreen(topWall)
            container.addChild(topWall); // puts wall at end of container's children array
            isTopWallScored = false;
        }
    })

    function wallIsAboveScreen(wall: Sprite) {
        return wall.y + wall.height / 2 + container.y < 0
    }

    function moveWallBelowScreen(wall: Sprite) {
        wall.y = app.screen.height - container.y + wall.height / 2
    }
}

let wallCount = 0;
function createHorizontalWall(xPosition: number, yPosition: number): SpriteIntersect {
    const wall = new SpriteIntersect(wallTexture);
    wall.name = `wall-${++wallCount}`
    wall.width = 300;
    wall.height = 40;
    wall.anchor.set(0.5, 0.5);


    const X_SCALE = 0.25;
    const Y_SCALE = 0.6;

    wall.x = xPosition * X_SCALE;
    wall.y = yPosition * Y_SCALE;

    return wall;
}

export function getWallRectPoints(index: number): number[] {
    let wall = wallsContainer.getChildAt(index).getBounds();
    const topLeftX = wall.x
    const topLeftY = wall.y

    const topRightX = wall.x + wall.width
    const topRightY = wall.y

    const bottomRightX = wall.x + wall.width
    const bottomRightY = wall.y + wall.height

    const bottomLeftX = wall.x
    const bottomLeftY = wall.y + wall.height

    return [topLeftX, topLeftY, topRightX, topRightY, bottomRightX, bottomRightY, bottomLeftX, bottomLeftY];
}
