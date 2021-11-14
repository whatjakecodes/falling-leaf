import './style.css'

import {Application} from "pixi.js";

export function getApp() {
    const app =
        new Application({
            width: 620,
            height: 440,
            transparent: false,
            resolution: 1
        });

    app.renderer.backgroundColor = 0x000000;
    // app.stage.filters = [new CRTFilter({curvature: 1, vignetting: 0})]
    document.body.appendChild(app.view);

    return app;
}
