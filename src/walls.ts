import {
    Texture,
    Container,
    Sprite,
    Ticker,
    Application
} from "pixi.js";

import { bindDownwardVelocity } from "./leaf";

let texture = Texture.from(
    "https://assets.codepen.io/195953/bricks_halfsy.png"
);

let downwardVelocity = 6;
bindDownwardVelocity((v: number) => {
    downwardVelocity = v;
});


export const initializeBrickWalls = (app: Application) => {
    const xScale = 0.25;
    const yScale = 0.6;
    const leftWall = getWall({
        x: -app.screen.width * xScale, // relative to container
        y: 0,
        anchor: { x: 0.5, y: 1 }
    });

    const rightWall = getWall({
        x: app.screen.width * xScale,
        y: app.screen.height * yScale,
        anchor: { x: 0.5, y: 1 }
    });

    const container = new Container();
    container.addChild(leftWall);
    container.addChild(rightWall);
    container.x = app.screen.width / 2;
    container.y = app.screen.height;
    app.stage.addChild(container);

    endlessScroll(app, container);
};

function endlessScroll(app: Application, container: Container) {
    const ticker = Ticker.shared;
    ticker.add(() => {
        // todo: this constant will vary based on leaf rotation
        container.y = container.y - downwardVelocity;

        const topWall = container.getChildAt(0) as Sprite;
        if (topWall.y + container.y < 0) {
            container.removeChild(topWall);
            topWall.y = app.screen.height - container.y + topWall.height;
            container.addChild(topWall);
        }

    })
}

type MyCoord = {x: number, y: number};

interface Wall extends MyCoord {
    anchor: MyCoord
}

function getWall({ x, y, anchor }: Wall): Sprite {
    const wall = new Sprite(texture);
    wall.x = x;
    wall.y = y;
    wall.anchor.set(anchor.x, anchor.y);
    wall.transform.scale.set(1, 0.7);
    // wall.transform.position.x
    return wall;
}


