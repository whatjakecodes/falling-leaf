import {
    Texture,
    Sprite,
    Container, Application, Ticker
} from "pixi.js";

import leafIconography from "./assets/leaf.svg";

let leaf: Container;
const DEFAULT_ROTATION = Math.PI;

let onVelocityUpdate: (x: number) => void;
export const bindDownwardVelocity = (doFunction: (x: number) => void) => {
    onVelocityUpdate = doFunction
};

export const initializeLeaf = (app: Application) => {
    const leafRasterTexture = Texture.from(
        leafIconography
    );

    const leafRaster = new Sprite(leafRasterTexture);
    leafRaster.anchor.x = 0.5;
    leafRaster.anchor.y = 0.5;
    leafRaster.scale.x = 0.5;
    leafRaster.scale.y = 0.5;

    let container = new Container();
    container.addChild(leafRaster);
    container.x = app.screen.width / 2;
    container.y = app.screen.height / 2;

    leaf = container;

    leaf.rotation = DEFAULT_ROTATION;

    app.stage.addChild(leaf);

    leafVelocity(leaf);
};

const angles = [0.4, 0.267, 0.133, -0.133, -0.267, -0.4];
let currentTwist = Math.floor(angles.length / 2);

const MAX_RIGHT = angles.length - 1;
const MAX_LEFT = 0;

const setTwist = (twist: number) => {
    leaf.rotation = DEFAULT_ROTATION + Math.PI * angles[twist];
};

const onPressLeft = () => {
    if (currentTwist === MAX_LEFT) return;
    setTwist(--currentTwist);
};

const onPressRight = () => {
    if (currentTwist === MAX_RIGHT) return;
    setTwist(++currentTwist);
};

const onKeyDown = (key: KeyboardEvent) => {
    if (key.code === "KeyA" || key.code === "ArrowLeft") {
        onPressLeft();
    }

    if (key.code === "KeyD" || key.code === "ArrowRight") {
        onPressRight();
    }
};

const leafVelocity = (leaf: Container) => {
    Ticker.shared.add(() => {
        leaf.x = leaf.x + (leaf.rotation - DEFAULT_ROTATION) / Math.PI * -12;


        // from 2 - 6
        const MAX_VELOCITY = 10;
        let newDownAngle = Math.abs(leaf.rotation - DEFAULT_ROTATION) / Math.PI;
        const newDownwardVelocity = MAX_VELOCITY - newDownAngle * MAX_VELOCITY;
        onVelocityUpdate(newDownwardVelocity);
    })
}



document.addEventListener("keydown", onKeyDown);