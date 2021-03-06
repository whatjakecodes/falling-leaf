import {
    Texture,
    Container, Application, Ticker
} from "pixi.js";

import leafIconography from "../assets/leaf.svg";
import {SpriteIntersect} from "../vendorTypes/yy-intersect";
import {getScore, getWallRectPoints, stopWalls} from "./walls";
import {showRestart} from "../menu";

let leaf: Container;
const DEFAULT_ROTATION = Math.PI;

export type VelocityUpdater = (x: number) => void

let setDownwardVelocity: VelocityUpdater;
export const bindDownwardVelocity = (handler: VelocityUpdater) => {
    setDownwardVelocity = handler
};

export const initializeLeaf = (app: Application) => {
    const leafTexture = Texture.from(
        leafIconography
    );

    let container = new Container();
    container.x = app.screen.width / 2;
    container.y = app.screen.height / 2;

    const leafSpriteIntersect = new SpriteIntersect(leafTexture);
    leafSpriteIntersect.anchor.x = 0.5;
    leafSpriteIntersect.anchor.y = 0.5;
    leafSpriteIntersect.scale.x = 0.5;
    leafSpriteIntersect.scale.y = 0.5;

    container.addChild(leafSpriteIntersect);

    leafSpriteIntersect.name = "LEAF"

    leaf = container;
    setDefaultLeafRotation();
    app.stage.addChild(leaf);

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("keyup", onKeyUp);

    startLeafVelocity(leaf, app.screen.width);
};

export const getLeafTopY = () => {
    return leaf.y - 0.5*leaf.height
}

export const restartLeaf = (app: Application) => {
    leaf.x = app.screen.width / 2;
    leaf.y = app.screen.height / 2;

    setDefaultLeafRotation();

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("keyup", onKeyUp);

    setDownwardVelocity(6)
    leafTicker.start()
};

const angles = [0.4, 0.2, -0.2, -0.4];
let currentTwist: number;

const MAX_RIGHT = angles.length - 1;
const MAX_LEFT = 0;

const setTwist = (twist: number) => {
    leaf.rotation = DEFAULT_ROTATION + Math.PI * angles[twist];
};

function setDefaultLeafRotation() {
    setTwist(MAX_RIGHT);
    currentTwist = MAX_RIGHT;
}

const onPressLeft = () => {
    if (currentTwist === MAX_LEFT) return;
    setTwist(--currentTwist);
};

const onPressRight = () => {
    if (currentTwist === MAX_RIGHT) return;
    setTwist(++currentTwist);
};


let isKeyDown = false;
let timeoutId: number;
const onKeyDown = (key: KeyboardEvent) => {
    if (isKeyDown) return;
    isKeyDown = true;

    clearTimeout(timeoutId);

    timeoutId = setTimeout(function updateAngle() {

        if (!isKeyDown) return

        setAngle();

        timeoutId = setTimeout(updateAngle, 125)
    }, 50);

    function setAngle() {
        if (key.code === "KeyA" || key.code === "ArrowLeft") {
            onPressLeft();
        }

        if (key.code === "KeyD" || key.code === "ArrowRight") {
            onPressRight();
        }
    }
};

const onKeyUp = () => {
    clearTimeout(timeoutId)
    isKeyDown = false
};

let leafTicker: Ticker;
const startLeafVelocity = (leafContainer: Container, screenWidth: number) => {
    leafTicker = Ticker.shared.add(() => {
        const leafSprite = leafContainer.getChildAt(0) as SpriteIntersect ;
        const wallRectPoints1 = getWallRectPoints(0);
        const wallRectPoints2 = getWallRectPoints(1);
        if(leafSprite.collides(wallRectPoints1) || leafSprite.collides(wallRectPoints2) || collidesBorderWall(screenWidth)) {
            onLeafCollision()
            return;
        }

        leafContainer.x = leafContainer.x + (leafContainer.rotation - DEFAULT_ROTATION) / Math.PI * -12;
        const MAX_VELOCITY = 8;
        let newDownAngle = Math.abs(leafContainer.rotation - DEFAULT_ROTATION) / Math.PI;

        const newDownwardVelocity = MAX_VELOCITY - newDownAngle * MAX_VELOCITY;
        setDownwardVelocity(newDownwardVelocity);
    })

    function collidesBorderWall(screenWidth: number): boolean {
        const leafRight = leafContainer.x + leafContainer.width;
        const leafLeft = leafContainer.x - leafContainer.width;

        const wallWidth = 20;

        const rightWallEdge = screenWidth - wallWidth;
        const leftWallEdge = wallWidth;

        const collidesRightWall = leafRight >= rightWallEdge;
        const collidesLeftWall = leafLeft <= leftWallEdge;
        return collidesRightWall || collidesLeftWall;
    }
}

export const stopLeaf = () => {
    if (leafTicker) leafTicker.stop()
    setDownwardVelocity(0)
}

const onLeafCollision = () => {
    stopLeaf();
    stopWalls();
    showRestart(getScore());
    clearLeafControls();
}

function clearLeafControls() {
    document.removeEventListener("keydown", onKeyDown);
    document.removeEventListener("keyup", onKeyUp);
    if (timeoutId) {
        clearTimeout(timeoutId)
        isKeyDown = false
    }
}