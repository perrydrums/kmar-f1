import { Food } from './food.js';
export class Anvil extends Food {
    constructor(s) {
        super();
        this.subject = s;
        s.subscribe(this);
        this._element = document.createElement("anvil");
        let foreground = document.getElementsByTagName("foreground")[0];
        foreground.appendChild(this._element);
    }
    action() {
        this.game.addScore(0);
        alert("Je bent de helft van je benzine verloren!");
    }
    notify() {
        this.element.remove();
        this.subject.unsubscribe(this);
        this.game.food.slice(this.game.food.indexOf(this), 1);
    }
}
