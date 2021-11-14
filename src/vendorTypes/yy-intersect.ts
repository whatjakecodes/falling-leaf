import {Sprite, Point, Texture} from "pixi.js";
// @ts-ignore
import * as Intersects from "yy-intersects";
import {MyCoord} from "../walls";

export interface SpriteIntersect extends Sprite {
    shape: YyShape
}

export interface YyShape {
    collidesPoint: (point: Point) => boolean
    collidesRectangle: (rectangle: Intersects.Rectangle) => boolean
    set: (options: RectangleOptions) => void
}

interface RectangleOptions {
    width?: number
    height?: number
    square?: number
    center?: MyCoord
    // rotation?: MyCoord
    noRotate?: boolean
}

export class SpriteIntersect extends Sprite {
    shape: YyShape;

    constructor(texture: Texture, options: RectangleOptions) {
        super(texture);

        // if (options?.center == null) {
        //     options.center = this
        // }
        const rect = new Intersects.Rectangle(this, options);
        this.shape = rect;
    }
}

export function setY(target: SpriteIntersect, y: number) {
    target.y = y
    // target.shape.set({center: {x: target.x, y}})
}