import { Food } from './food.js';
export class Tire extends Food {
    constructor(lane) {
        super();
        this.lane = lane;
        this._element = document.createElement("tire");
        let foreground = document.getElementsByTagName("foreground")[0];
        foreground.appendChild(this._element);
        if (this.lane === 1) {
            this._element.classList.add("tire1");
        }
        else if (this.lane === 2) {
            this._element.classList.add("tire2");
        }
        else if (this.lane === 3) {
            this._element.classList.add("tire3");
        }
    }
    action() {
        this.game.addTire();
    }
}
