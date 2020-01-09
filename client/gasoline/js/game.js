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
        this.rainTiresUnlocked = false;
        this._fps = 30;
    }
    initialize() {
        Start.getInstance().show();
        this.socket = io({ timeout: 60000 });
        this._fpsInterval = 1000 / this._fps;
        this._then = Date.now();
        this.socket.emit('gasoline:start', {
            uuid: this.getCookie('uuid'),
        });
        this.socket.on('server:gasoline:upgrades', (data) => {
            if (data.upgrades['rain-tires'])
                this.rainTiresUnlocked = true;
        });
        this.socket.on('server:research:unlock:rain-tires', (data) => {
            this.rainTiresUnlocked = true;
        });
        this.socket.on('finish', (data) => {
            window.location.href = '/finish';
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
    addTire(rainTire = false) {
        if (rainTire) {
            this.socket.emit('gasoline:update', { rainTire: true });
        }
        else {
            this.socket.emit('gasoline:update', { tire: true });
        }
    }
    showScore() {
    }
    gameLoop() {
        const now = Date.now();
        const elapsed = now - this._then;
        if (elapsed > this._fpsInterval) {
            this.character.update();
            this.subject.update();
            for (let f of this.food) {
                f.update();
            }
            if (this.food.length <= 6) {
                for (let food of this.createFood(1)) {
                    this.food.push(food);
                }
            }
            this._then = now - (elapsed % this._fpsInterval);
        }
        requestAnimationFrame(() => this.gameLoop());
    }
    createFood(amount) {
        let food = [];
        for (let i = 0; i < amount; i++) {
            const random = Math.floor(Math.random() * 100);
            if (random > 0 && random < 45) {
                let randomLane = Math.floor(Math.random() * 3) + 1;
                food.push(new Anvil(this.subject, randomLane));
            }
            else if (random > 45 && random < 75) {
                let randomLane = Math.floor(Math.random() * 3) + 1;
                food.push(new Tire(randomLane));
            }
            else if (random > 75 && random < 90 && this.rainTiresUnlocked) {
                let randomLane = Math.floor(Math.random() * 3) + 1;
                food.push(new RainTire(randomLane));
            }
            else {
                let randomLane = Math.floor(Math.random() * 3) + 1;
                food.push(new Fuel(randomLane));
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
