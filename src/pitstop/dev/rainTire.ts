import {Tire} from "./tire.js";

export class RainTire extends Tire {

    public show() {
        this._element = document.createElement('div');
        this._element.classList.add('tire');
        this._element.classList.add('tire--rain');
        document.getElementById('tirerack--rain').appendChild(this._element);
    }

}
