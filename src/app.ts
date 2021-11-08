import './style.css'

import {Application} from "pixi.js";

export function getApp() {
    const app =
        new Application({
            width: 600,
            height: 600,
            transparent: false,
            resolution: 1
        });

    app.renderer.backgroundColor = 0x000000;
    document.body.appendChild(app.view);

    return app;
}
