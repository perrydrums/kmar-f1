import { Food } from './food.js';
export class RainTire extends Food {
    constructor(lane) {
        super();
        this.lane = lane;
        this._element = document.createElement("rain-tire");
        let foreground = document.getElementsByTagName("foreground")[0];
        foreground.appendChild(this._element);
        if (this.lane === 1) {
            this._element.classList.add("rain-tire1");
        }
        else if (this.lane === 2) {
            this._element.classList.add("rain-tire2");
        }
        else if (this.lane === 3) {
            this._element.classList.add("rain-tire3");
        }
    }
    action() {
        this.game.addTire(true);
    }
}
