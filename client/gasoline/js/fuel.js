import { Food } from './food.js';
export class Fuel extends Food {
    constructor() {
        super();
        this._element = document.createElement("fuel");
        let foreground = document.getElementsByTagName("foreground")[0];
        foreground.appendChild(this._element);
    }
    action() {
        this.game.addScore(25);
    }
}
