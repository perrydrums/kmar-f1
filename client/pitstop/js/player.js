import { Game } from "./game.js";
import { Tire } from "./tire.js";
import { RainTire } from "./rainTire.js";
export class Player {
    constructor() {
        this.flipped = false;
        this.speedX = 0;
        this.speedY = 0;
        this.posX = 0;
        this.posY = 0;
        this.hasGasoline = false;
        this.occupied = false;
        this._element = document.createElement('div');
        this._element.classList.add('player');
        document.body.appendChild(this._element);
        window.addEventListener('keydown', (e) => this.onKeyDown(e));
        window.addEventListener('keyup', (e) => this.onKeyUp(e));
        setInterval(() => {
            this.flipped = !this.flipped;
        }, 500);
    }
    update() {
        const scaleX = this.flipped ? '-1' : '1';
        this._element.style.transform = `translate(${this.posX += this.speedX}px, ${this.posY += this.speedY}px) scaleX(${scaleX})`;
        this.currentTire ? this._element.classList.add('has-tire') : this._element.classList.remove('has-tire');
        this.hasGasoline ? this._element.classList.add('has-gasoline') : this._element.classList.remove('has-gasoline');
        this.hasGasoline ? document.getElementById("gasoline").classList.add('withoutHose') : document.getElementById("gasoline").classList.remove('withoutHose');
    }
    onKeyDown(e) {
        switch (e.keyCode) {
            case 37:
                this.speedX = -15;
                break;
            case 38:
                this.speedY = -15;
                break;
            case 40:
                this.speedY = 15;
                break;
            case 39:
                this.speedX = 15;
                break;
            case 32:
                this.interactHold();
                break;
        }
    }
    onKeyUp(e) {
        switch (e.keyCode) {
            case 37:
            case 39:
                this.speedX = 0;
                break;
            case 38:
            case 40:
                this.speedY = 0;
                break;
            case 32:
                this.interact();
                break;
        }
    }
    isCollision(element) {
        return this._element.getBoundingClientRect().left < element.getBoundingClientRect().right &&
            this._element.getBoundingClientRect().right > element.getBoundingClientRect().left &&
            this._element.getBoundingClientRect().bottom > element.getBoundingClientRect().top &&
            this._element.getBoundingClientRect().top < element.getBoundingClientRect().bottom;
    }
    interact() {
        this.occupied = false;
        const gasoline = document.getElementById('gasoline');
        if (this.isCollision(gasoline) && !this.currentTire) {
            this.hasGasoline = !this.hasGasoline;
            this.occupied = true;
        }
        const tirerack = document.getElementById('tirerack');
        const tirerackRain = document.getElementById('tirerack--rain');
        if (this.isCollision(tirerack) && this.currentTire && !this.occupied) {
            if (Game.getInstance().tires.length < 4) {
                Game.getInstance().tires.push(new Tire());
            }
            this.currentTire = null;
            this.occupied = true;
        }
        if (this.isCollision(tirerackRain) && this.currentTire instanceof RainTire && !this.occupied) {
            if (Game.getInstance().tires.length < 4) {
                Game.getInstance().tires.push(new RainTire());
            }
            this.currentTire = null;
            this.occupied = true;
        }
        const tires = Game.getInstance().tires;
        for (let i = 0; i < tires.length; i++) {
            if (this.isCollision(tires[i]._element) && !this.hasGasoline && !this.occupied) {
                if (!this.currentTire) {
                    tires[i].grabbed();
                    this.currentTire = tires[i];
                    Game.getInstance().tires.splice(i, 1);
                }
                this.occupied = true;
            }
        }
        const car = Game.getInstance()._car;
        if (car) {
            if (this.isCollision(car._element)) {
                if (this.currentTire && car.tires.length < 4) {
                    car.addTire(this.currentTire);
                    this.currentTire = null;
                }
                this.occupied = true;
            }
        }
    }
    interactHold() {
        const car = Game.getInstance()._car;
        const gasmeter = Game.getInstance().gasmeter;
        if (car && this.hasGasoline && gasmeter.amount > 0) {
            if (this.isCollision(car._element)) {
                gasmeter.drain();
                car.fill();
            }
        }
    }
}
