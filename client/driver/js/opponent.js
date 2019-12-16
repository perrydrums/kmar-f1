import { Game } from './game.js';
export class Opponent {
    constructor() {
        this.posy = -200;
        this.posx = Math.floor(Math.random() * 780) + 400;
        this.speed = (Math.random() * 5 + 15) * (Game.getInstance().speed || 1);
        this.game = Game.getInstance();
        this._element = document.createElement("div");
        this._element.classList.add('opponent');
        let randomColor = Math.random() * 360;
        this._element.style.webkitFilter = "hue-rotate(" + randomColor + "deg)";
        this._element.style.filter = "hue-rotate(" + randomColor + "deg)";
        document.body.appendChild(this._element);
    }
    update() {
        if (this.posy >= window.innerHeight) {
            this.remove();
            const index = this.game.opponent.indexOf(this);
            this.game.opponent.splice(index, 1);
        }
        else {
            this.posy += this.speed;
            this._element.style.transform = `translate(${this.posx}px, ${this.posy}px)`;
        }
    }
    get element() {
        return this._element;
    }
    remove() {
        this._element.remove();
    }
    action() { }
}
