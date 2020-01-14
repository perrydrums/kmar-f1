import { Food } from './food.js';

export class SmallFuel extends Food {

    constructor(){
        super();
        this._element = document.createElement("small-fuel")
        let foreground = document.getElementsByTagName("foreground")[0]
        foreground.appendChild(this._element);
    }

    public action(){
        this.game.addScore(5);
    }
}