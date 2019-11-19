import { Game } from './game.js';
export class Vehicle {
    constructor() {
        this.counter = 0;
        this.speed = 0;
        this.game = Game.getInstance();
        this.posx = 100;
    }
    bounce(x) {
        if (this.counter === 15) {
            this.posy += 5 * x;
            this.counter++;
        }
        else if (this.counter === 30) {
            this.posy -= 5 * x;
            this.counter = 0;
        }
        else {
            this.counter++;
        }
    }
    checkCollision() {
        if (this.posx > window.innerWidth - this.element.clientWidth) {
            this.game.winner(this);
        }
    }
    update() {
        this.bounce(2);
    }
}
