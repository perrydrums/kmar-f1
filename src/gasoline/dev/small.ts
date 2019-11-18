import { Food } from './food.js';

export class Small extends Food {

    constructor(){
        super();
        this._element = document.createElement("small")
        let foreground = document.getElementsByTagName("foreground")[0]
        foreground.appendChild(this._element);
    }

    public action(){
        this.game.addScore(5);
    }
}