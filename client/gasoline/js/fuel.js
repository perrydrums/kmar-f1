import { Food } from './food.js';
export class Fuel extends Food {
    constructor(lane) {
        super();
        this.lane = lane;
        this._element = document.createElement("fuel");
        let foreground = document.getElementsByTagName("foreground")[0];
        foreground.appendChild(this._element);
        if (this.lane === 1) {
            this._element.classList.add("fuel1");
        }
        else if (this.lane === 2) {
            this._element.classList.add("fuel2");
        }
        else if (this.lane === 3) {
            this._element.classList.add("fuel3");
        }
    }
    action() {
        this.game.addScore(25);
    }
}
