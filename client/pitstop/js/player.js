import { Game } from "./game.js";
export class Player {
    constructor() {
        this.flipped = false;
        this.speedX = 0;
        this.speedY = 0;
        this.posX = 0;
        this.posY = 0;
        this.hasGasoline = false;
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
        if (this._element.getBoundingClientRect().left < element.getBoundingClientRect().right &&
            this._element.getBoundingClientRect().right > element.getBoundingClientRect().left &&
            this._element.getBoundingClientRect().bottom > element.getBoundingClientRect().top &&
            this._element.getBoundingClientRect().top < element.getBoundingClientRect().bottom) {
            return true;
        }
        return false;
    }
    interact() {
        const gasoline = document.getElementById('gasoline');
        if (this.isCollision(gasoline) && !this.currentTire) {
            this.hasGasoline = !this.hasGasoline;
        }
        const tires = Game.getInstance().tires;
        for (let i = 0; i < tires.length; i++) {
            if (this.isCollision(tires[i]._element) && !this.hasGasoline) {
                if (!this.currentTire) {
                    tires[i].grabbed();
                    this.currentTire = tires[i];
                }
            }
        }
        const car = Game.getInstance()._car;
        if (car) {
            if (this.isCollision(car._element)) {
                if (this.currentTire) {
                    car.addTire(this.currentTire);
                    this.currentTire = null;
                }
            }
        }
    }
    interactHold() {
        const car = Game.getInstance()._car;
        const gasmeter = Game.getInstance().gasmeter;
        if (car && this.hasGasoline) {
            if (this.isCollision(car._element)) {
                gasmeter.drain();
                car.fill();
            }
        }
    }
}
