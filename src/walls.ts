import {Application, Container, Texture, Ticker,} from "pixi.js";
import {PixelateFilter} from '@pixi/filter-pixelate';

import {bindDownwardVelocity} from "./leaf";
import {SpriteIntersect} from "./vendorTypes/yy-intersect";
import brickIconography from "./assets/bricks_smallllll.jpg";

let wallTexture = Texture.from(brickIconography);

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
        x: -app.screen.width * xScale,
        y: 0,
        anchor: {x: 0.5, y: 0.5}
    });

    const rightWall = createWall({
        x: app.screen.width * xScale,
        y: app.screen.height * yScale,
        anchor: {x: 0.5, y: 0.5}
    });

    leftWall.filters = [new PixelateFilter(5)];
    rightWall.filters = [new PixelateFilter(5)];

    wallsContainer.addChild(leftWall);
    wallsContainer.addChild(rightWall);
    app.stage.addChild(wallsContainer);

    endlessScroll(app, wallsContainer);
};

function endlessScroll(app: Application, container: Container) {
    const ticker = Ticker.shared;
    ticker.add(() => {
        container.y = container.y - downwardVelocity;

        const topWall = container.getChildAt(0) as SpriteIntersect;
        if (topWall.y + topWall.height / 2 + container.y < 0) {
            container.removeChild(topWall);
            topWall.y = app.screen.height - container.y + topWall.height / 2
            container.addChild(topWall);
        }
    })
}

export type MyCoord = { x: number, y: number };

interface Wall extends MyCoord {
    anchor: MyCoord
}

function createWall({x, y, anchor}: Wall): SpriteIntersect {
    const wall = new SpriteIntersect(wallTexture);
    wall.name = `wall-${x}`

    wall.x = x;
    wall.y = y;
    wall.anchor.set(anchor.x, anchor.y);
    wall.width = 300;
    wall.height = 40;
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
