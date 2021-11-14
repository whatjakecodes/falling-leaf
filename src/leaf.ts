import {
    Texture,
    Container, Application, Ticker
} from "pixi.js";

import leafIconography from "./assets/leaf.svg";
import {SpriteIntersect} from "./vendorTypes/yy-intersect";
import {getWallRect} from "./walls";

let leaf: Container;
const DEFAULT_ROTATION = Math.PI;

let onVelocityUpdate: (x: number) => void;
export const bindDownwardVelocity = (doFunction: (x: number) => void) => {
    onVelocityUpdate = doFunction
};

export const initializeLeaf = (app: Application) => {
    const leafTexture = Texture.from(
        leafIconography
    );

    let container = new Container();
    container.x = app.screen.width / 2;
    container.y = app.screen.height / 2;

    const width = 100;
    const height = 125;
    // const {width,height} = leafTexture;
    const leafSpriteIntersect = new SpriteIntersect(leafTexture, {width,height});
    leafSpriteIntersect.anchor.x = 0.5;
    leafSpriteIntersect.anchor.y = 0.5;
    leafSpriteIntersect.scale.x = 0.5;
    leafSpriteIntersect.scale.y = 0.5;

    container.addChild(leafSpriteIntersect);

    leafSpriteIntersect.name = "LEAF"

    leaf = container;

    leaf.rotation = DEFAULT_ROTATION;

    app.stage.addChild(leaf);

    leafVelocity(leaf);
};

const angles = [0.4, 0.2, -0.2, -0.4];
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

let timer = 0;
const leafVelocity = (leaf: Container) => {
    Ticker.shared.add(() => {
        timer += 1;
        const leafSprite = leaf.getChildAt(0) as SpriteIntersect;
        let wallRect = getWallRect(0);
        if(leafSprite.shape.collidesRectangle(wallRect) && timer > 60*2) {
            // onVelocityUpdate(0);
            // return;
        }

        // from 2 - 6
        leaf.x = leaf.x + (leaf.rotation - DEFAULT_ROTATION) / Math.PI * -12;
        const MAX_VELOCITY = 10;
        let newDownAngle = Math.abs(leaf.rotation - DEFAULT_ROTATION) / Math.PI;

        const newDownwardVelocity = MAX_VELOCITY - newDownAngle * MAX_VELOCITY;
        onVelocityUpdate(newDownwardVelocity);
    })
}


document.addEventListener("keydown", onKeyDown);
document.addEventListener("keyup", onKeyUp);