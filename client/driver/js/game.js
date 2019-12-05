import { Car } from "./car.js";
import { Opponent } from "./opponent.js";
import { Dialog } from "./dialog.js";
export class Game {
    constructor() {
        this._fps = 30;
        this._carTime = 0;
        this.running = false;
        this.sequenceCount = 0;
        this.opponent = [];
        this._fpsInterval = 1000 / this._fps;
        this._then = Date.now();
        this.gameLoop();
    }
    static getInstance() {
        if (!this._instance) {
            this._instance = new Game();
        }
        return this._instance;
    }
    startGame() {
        this.running = true;
    }
    gameLoop() {
        requestAnimationFrame(() => this.gameLoop());
        const now = Date.now();
        const elapsed = now - this._then;
        if (this.running) {
            if (elapsed > this._fpsInterval) {
                this.checkCar();
                this.checkCollision();
                for (let o of this.opponent) {
                    o.update();
                }
                if (this.opponent.length <= 2) {
                    for (let opponent of this.spawnOpponent(2)) {
                        this.opponent.push(opponent);
                    }
                }
                this._then = now - (elapsed % this._fpsInterval);
            }
        }
        else {
            if (!this.dialog) {
                this.dialog = Dialog.getInstance();
                this.dialog.setHTML('<h1>KMar F1 - Aerodynamica</h1>' +
                    '<p>Jij bent verantwoordelijk voor de pitstop. Probeer de snelste tijd neer te zetten.</p>' +
                    '<p>Beweeg met de pijltjestoetsen en pak spullen vast met de spatiebalk.</p>' +
                    '<p>Zet de banden op de auto en vul de auto met benzine.</p>');
                this.dialog.addButton();
            }
        }
    }
    checkCollision() {
        for (let i = 0; i < this.opponent.length; i++) {
            if (this._car._element.getBoundingClientRect().left < this.opponent[i].element.getBoundingClientRect().right &&
                this._car._element.getBoundingClientRect().right > this.opponent[i].element.getBoundingClientRect().left &&
                this._car._element.getBoundingClientRect().bottom > this.opponent[i].element.getBoundingClientRect().top &&
                this._car._element.getBoundingClientRect().top < this.opponent[i].element.getBoundingClientRect().bottom) {
                this.opponentHit = document.createElement('div');
                this.opponentHit.classList.add('opponentHit');
                document.body.appendChild(this.opponentHit);
                this.opponentHit.style.transform = `translate(${this._car.posX - 80}px, ${this._car.posY - 200}px)`;
                setTimeout(() => { this.opponentHit.remove(); this._car.hit = false; }, 5000);
            }
        }
    }
    spawnOpponent(amount) {
        let opponent = [];
        for (let i = 0; i < amount; i++) {
            opponent.push(new Opponent());
        }
        console.log(opponent);
        return opponent;
    }
    checkCar() {
        if (this._carTime > this._fps * 0) {
            if (!this._car) {
                this._car = new Car();
            }
            this._carTime = 0;
        }
        this._carTime++;
        if (this._car) {
            this._car.update();
            if (this._car.done) {
                this._car = null;
            }
        }
    }
}
window.addEventListener("load", () => {
    Game.getInstance();
});
