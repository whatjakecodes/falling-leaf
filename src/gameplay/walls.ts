import {Application, Container, Sprite, Texture, Ticker} from "pixi.js";

import {bindDownwardVelocity, getLeafTopY} from "./leaf";
import {SpriteIntersect} from "../vendorTypes/yy-intersect";
import brickIconography from "../assets/bricks_smallllll.jpg";
import verticalWallIconography from "../assets/vertical_wall.jpg";

const wallTexture = Texture.from(brickIconography);
const verticalWallTexture = Texture.from(verticalWallIconography);

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

    endlessObstacleWallsScroll(app, wallsContainer);
    configureBorderWalls(app);
};

function configureBorderWalls(app: Application) {
    const verticalWallsContainer = new Container();
    const borderWalls = [
        createRightVerticalWall(app),
        createRightVerticalWall(app),
        createLeftVerticalWall(app),
        createLeftVerticalWall(app)
    ]
    borderWalls.forEach(wall => verticalWallsContainer.addChild(wall));
    app.stage.addChild(verticalWallsContainer);
    endlessVerticalWallScroll(app, verticalWallsContainer);
}

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

function endlessObstacleWallsScroll(app: Application, container: Container) {
    wallTicker = Ticker.shared.add(() => {
        container.y = container.y - downwardVelocity;

        const topWall = container.getChildAt(0) as SpriteIntersect;
        calculateScore(topWall, container);

        if (wallIsAboveScreen(topWall, container)) {
            container.removeChild(topWall);
            moveWallBelowScreen(topWall, container, app.screen.height)
            container.addChild(topWall); // puts wall at end of container's children array
            isTopWallScored = false;
        }
    })
}

function calculateScore(topWall: SpriteIntersect, container: Container) {
    const leafTopY = getLeafTopY();
    const topWallBottomY = topWall.y + container.y;
    if (leafTopY > topWallBottomY && !isTopWallScored) {
        isTopWallScored = true;
        score += 1;
    }
}

function endlessVerticalWallScroll(app: Application, container: Container) {
    Ticker.shared.add(() => {
        container.y = container.y - downwardVelocity;

        const rightWall1 = container.getChildByName("right-wall-1") as Sprite;
        const leftWall1 = container.getChildByName("left-wall-1") as Sprite;
        const rightWall2 = container.getChildByName("right-wall-2") as Sprite;
        const leftWall2 = container.getChildByName("left-wall-2") as Sprite;

        if (wallIsAboveScreen(rightWall1, container)) {
            moveWallBelowScreen(rightWall1, container, app.screen.height)
            moveWallBelowScreen(leftWall1, container, app.screen.height)
        } else if (wallIsAboveScreen(rightWall2, container)) {
            moveWallBelowScreen(rightWall2, container, app.screen.height)
            moveWallBelowScreen(leftWall2, container, app.screen.height)
        }
    })
}

function wallIsAboveScreen(wall: Sprite, container: Container) {
    return wall.y + wall.height / 2 + container.y < 0
}

function moveWallBelowScreen(wall: Sprite, container: Container, screenHeight: number) {
    wall.y = screenHeight - container.y + wall.height / 2
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


let rightVerticalWallCount = 0;

function createRightVerticalWall(app: Application) {
    rightVerticalWallCount += 1;

    const xPosition = app.screen.width - 20;
    const offset = (rightVerticalWallCount - 1) * app.screen.height;
    const yPosition = offset + app.screen.height / 2;
    const wall = createVerticalWall(xPosition, yPosition)
    wall.name = `right-wall-${rightVerticalWallCount}`;
    return wall;
}

let leftVerticalWallCount = 0;

function createLeftVerticalWall(app: Application) {
    leftVerticalWallCount += 1;

    const xPosition = 20;
    const offset = (leftVerticalWallCount - 1) * app.screen.height;
    const yPosition = offset + app.screen.height / 2;
    const wall = createVerticalWall(xPosition, yPosition)
    wall.name = `left-wall-${leftVerticalWallCount}`;
    return wall;
}


function createVerticalWall(xPosition: number, yPosition: number): SpriteIntersect {
    const verticalWall = new SpriteIntersect(verticalWallTexture);
    verticalWall.width = 40;
    verticalWall.height = 444;
    verticalWall.anchor.set(0.5, 0.5);
    verticalWall.x = xPosition;
    verticalWall.y = yPosition;
    return verticalWall
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
