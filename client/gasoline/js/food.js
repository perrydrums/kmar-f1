import { Anvil } from './anvil.js';
import { Game } from './game.js';
export class Food {
    constructor(lane) {
        this.posy = -200;
        this.lane = lane;
        this.posx = Math.random() * (window.innerWidth - 300);
        this.speed = Math.random() * 5 + 1;
        this.game = Game.getInstance();
    }
    update() {
        if (this.posy >= window.innerHeight + 200) {
            if (this instanceof Anvil) {
                this.remove();
                this.subject.unsubscribe(this);
            }
            this.remove();
            const index = this.game.food.indexOf(this);
            this.game.food.splice(index, 1);
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
