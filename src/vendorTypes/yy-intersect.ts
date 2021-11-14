import {Sprite} from "pixi.js";
import {polygonPolygon} from "../intersects";

export class SpriteIntersect extends Sprite {

    collides(opponent: number[]): boolean {
        let leafPoints = this.getLeafPoints();
        let collisionDetected = polygonPolygon(leafPoints, opponent);
        return collisionDetected;
    }

    getLeafPoints(): number[] {
        //   __*__
        //  |  |  |
        //  |/   \|
        //  *     *
        //  |\   /|
        //  |__*__|

        const sprite = this;
        const width = 100 / 2, height = 125 / 2;

        const {x: topX, y: topY} = sprite.toGlobal({x: 0, y: -height / 2});
        const {x: rightX, y: rightY} = sprite.toGlobal({x: width / 2, y: 0});
        const {x: bottomX, y: bottomY} = sprite.toGlobal({x: 0, y: height / 2});
        const {x: leftX, y: leftY} = sprite.toGlobal({x: -width / 2, y: 0});

        return [topX, topY, rightX, rightY, bottomX, bottomY, leftX, leftY];
    }
}