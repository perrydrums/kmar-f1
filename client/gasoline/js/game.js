import { Character } from './character.js';
import { DeleteNotifier } from './deleteNotifier.js';
import { Anvil } from './anvil.js';
import { Tire } from './tire.js';
import { RainTire } from './rainTire.js';
import { Fuel } from './fuel.js';
import { Start } from './start.js';
export class Game {
    constructor() {
        this.score = 0;
        this.food = [];
        this.powerup = false;
        this.subject = new DeleteNotifier();
    }
    initialize() {
        Start.getInstance().show();
        this.socket = io({ timeout: 60000 });
        this.socket.emit('gasoline:start', {
            uuid: this.getCookie('uuid'),
        });
    }
    start() {
        this.food = this.createFood(4);
        this.character = new Character();
        this.gameLoop();
    }
    static getInstance() {
        if (!Game.instance) {
            Game.instance = new Game();
        }
        return Game.instance;
    }
    addScore(amount) {
        this.socket.emit('gasoline:update', { gasoline: amount });
        if (amount === 0) {
            this.score = Math.round(this.score / 2);
        }
        else if (this.score >= 150) {
            this.score = 150;
        }
        else {
            Math.round(this.score += amount);
        }
    }
    showScore() {
    }
    gameLoop() {
        this.character.update();
        this.subject.update();
        for (let f of this.food) {
            f.update();
        }
        if (this.food.length <= 2) {
            for (let food of this.createFood(2)) {
                this.food.push(food);
            }
        }
        requestAnimationFrame(() => this.gameLoop());
    }
    createFood(amount) {
        let food = [];
        for (let i = 0; i < amount; i++) {
            const random = Math.floor(Math.random() * 100);
            if (random > 40) {
                food.push(new Anvil(this.subject));
            }
            else {
                food.push(new Fuel());
                const random = Math.floor(Math.random() * 100);
                if (random > 40) {
                    food.push(new RainTire());
                }
                else {
                    food.push(new Tire());
                }
            }
        }
        return food;
    }
    getCookie(name) {
        const value = "; " + document.cookie;
        const parts = value.split("; " + name + "=");
        if (parts.length == 2)
            return parts.pop().split(";").shift();
    }
}
window.addEventListener("load", () => {
    const g = Game.getInstance();
    g.initialize();
});
