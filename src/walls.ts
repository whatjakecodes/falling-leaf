import {
    Texture,
    Container,
    Ticker,
    Application
} from "pixi.js";

import { bindDownwardVelocity } from "./leaf";
import {SpriteIntersect, setY, YyShape} from "./vendorTypes/yy-intersect";

let wallTexture = Texture.from(
    "https://assets.codepen.io/195953/bricks_halfsy.png"
);

let downwardVelocity = 6;
bindDownwardVelocity((v: number) => {
    downwardVelocity = v;
});


const wallsContainer = new Container();
export const initializeBrickWalls = (app: Application) => {
    wallsContainer.x = app.screen.width / 2;
    wallsContainer.y = app.screen.height;

    const xScale = 0.25;
    const yScale = 0.6;
    const leftWall = createWall({
        x: -app.screen.width * xScale, // relative to wallsContainer
        y: 0,
        anchor: { x: 0.5, y: 0.5 }
    });

    const rightWall = createWall({
        x: app.screen.width * xScale,
        y: app.screen.height * yScale,
        anchor: { x: 0.5, y: 0.5 }
    });

    wallsContainer.addChild(leftWall);
    wallsContainer.addChild(rightWall);
    app.stage.addChild(wallsContainer);

    endlessScroll(app, wallsContainer);
};

function endlessScroll(app: Application, container: Container) {
    const ticker = Ticker.shared;
    ticker.add(() => {
        // todo: this constant will vary based on leaf rotation
        container.y = container.y - downwardVelocity;

        const topWall = container.getChildAt(0) as SpriteIntersect;
        if (topWall.y + topWall.height / 2 + container.y < 0) {
            container.removeChild(topWall);
            setY(topWall, app.screen.height - container.y + topWall.height / 2);
            // topWall.y = app.screen.height - container.y + topWall.height;
            container.addChild(topWall);
        }

    })
}

export type MyCoord = {x: number, y: number};

interface Wall extends MyCoord {
    anchor: MyCoord
}

function createWall({ x, y, anchor }: Wall): SpriteIntersect {
    const {width, height: textureHeight} = {width: 300, height: 224};
    const yScale = 1
    const height = textureHeight * yScale
    const wall = new SpriteIntersect(wallTexture, {width, height});
    wall.name = `wall-${x}`

    wall.x = x;
    wall.y = y;
    wall.anchor.set(anchor.x, anchor.y);
    wall.transform.scale.set(1, yScale);
    // wall.transform.position.x
    return wall;
}


export function getWallRect(index: number): YyShape {
    let wall = wallsContainer.getChildAt(index) as SpriteIntersect;
    return wall.shape;
}
