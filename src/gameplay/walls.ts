import {Application, Container, Sprite, Texture, Ticker,} from "pixi.js";

import {bindDownwardVelocity} from "./leaf";
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
let leftWall: Sprite;
let rightWall: Sprite;
export const initializeBrickWalls = (app: Application) => {
    wallsContainer.x = app.screen.width / 2;
    wallsContainer.y = app.screen.height;

    const xScale = 0.25;
    const yScale = 0.6;
    leftWall = createWall();
    leftWall.x = -app.screen.width * xScale;
    leftWall.y = 0;

    rightWall = createWall();
    rightWall.x = app.screen.width * xScale;
    rightWall.y = app.screen.height * yScale;

    wallsContainer.addChild(leftWall);
    wallsContainer.addChild(rightWall);
    app.stage.addChild(wallsContainer);

    INITIAL_LEFT_WALL_Y = leftWall.y;
    INITIAL_RIGHT_WALL_Y = rightWall.y;

    endlessScroll(app, wallsContainer);
};

export const stopWalls = () => {
    if (wallTicker) wallTicker.stop();
}

export const restartBrickWalls = (app: Application) => {
    wallsContainer.x = app.screen.width / 2;
    wallsContainer.y = app.screen.height;

    wallsContainer.removeChild(leftWall)
    wallsContainer.removeChild(rightWall)

    leftWall.y = INITIAL_LEFT_WALL_Y;
    rightWall.y = INITIAL_RIGHT_WALL_Y;

    wallsContainer.addChild(leftWall)
    wallsContainer.addChild(rightWall)

    wallTicker.start();
};

let wallTicker: Ticker;
function endlessScroll(app: Application, container: Container) {
    wallTicker = Ticker.shared.add(() => {
        container.y = container.y - downwardVelocity;

        const topWall = container.getChildAt(0) as SpriteIntersect;
        if (wallIsAboveScreen(topWall)) {
            container.removeChild(topWall);
            moveWallBelowScreen(topWall)
            container.addChild(topWall); // puts wall at end of container's children array
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
function createWall(): SpriteIntersect {
    const wall = new SpriteIntersect(wallTexture);
    wall.name = `wall-${++wallCount}`
    wall.width = 300;
    wall.height = 40;
    wall.anchor.set(0.5, 0.5);
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
