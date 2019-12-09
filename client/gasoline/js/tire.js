import { Food } from './food.js';
export class Tire extends Food {
    constructor() {
        super();
        this._element = document.createElement("tire");
        let foreground = document.getElementsByTagName("foreground")[0];
        foreground.appendChild(this._element);
    }
    action() {
        this.game.addTire();
    }
}
