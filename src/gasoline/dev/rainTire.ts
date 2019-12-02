import { Food } from './food.js';

export class RainTire extends Food {

    constructor(){
        super();
        this._element = document.createElement("rain-tire")
        let foreground = document.getElementsByTagName("foreground")[0]
        foreground.appendChild(this._element);
    }

    public action(){
        this.game.addTire(true);
    }
}