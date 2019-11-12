import { Anvil } from './anvil.js';
import { Walking } from './walking.js';
import { Powerup } from './powerup.js';
import { Game } from './game.js';
export class Character {
    constructor() {
        this.speed = 0;
        this.speedRight = 5;
        this.speedLeft = -5;
        this._htmlElement = document.createElement("div");
        document.body.appendChild(this.htmlElement).className = "character";
        this.powerup = new Powerup(this);
        this.food = Game.getInstance().food;
        this.posx = window.innerWidth / 2 - 100;
        this.posy = window.innerHeight - 150;
        this.htmlElement.style.transform = `translate(${this.posx}px, ${this.posy}px)`;
        this.noPowerup();
        window.addEventListener("keydown", (e) => this.onKeyDown(e));
        window.addEventListener("keyup", (e) => this.onKeyUp(e));
    }
    update() {
        this.behaviour.update();
        this.htmlElement.style.transform = `translate(${this.posx += this.speed}px, ${this.posy}px)`;
        for (let i = 0; i < this.food.length; i++) {
            if (this.htmlElement.getBoundingClientRect().left < this.food[i].element.getBoundingClientRect().right &&
                this.htmlElement.getBoundingClientRect().right > this.food[i].element.getBoundingClientRect().left &&
                this.htmlElement.getBoundingClientRect().bottom > this.food[i].element.getBoundingClientRect().top &&
                this.htmlElement.getBoundingClientRect().top < this.food[i].element.getBoundingClientRect().bottom) {
                if (this instanceof Anvil) {
                    this.subject.unsubscribe(this);
                }
                this.food[i].action();
                this.food[i].remove();
                Game.getInstance().food.splice(i, 1);
            }
        }
        if (this.htmlElement.getBoundingClientRect().left < this.powerup.element.getBoundingClientRect().right &&
            this.htmlElement.getBoundingClientRect().right > this.powerup.element.getBoundingClientRect().left &&
            this.htmlElement.getBoundingClientRect().bottom > this.powerup.element.getBoundingClientRect().top &&
            this.htmlElement.getBoundingClientRect().top < this.powerup.element.getBoundingClientRect().bottom &&
            this.powerup.now) {
            this.powerup.action();
            Game.getInstance().powerup = true;
        }
        if (this.posx >= window.innerWidth - 120) {
            this.speedRight = 0;
        }
        if (this.posx <= 0) {
            this.speedLeft = 0;
        }
    }
    noPowerup() {
        this.behaviour = new Walking(this);
    }
    get htmlElement() {
        return this._htmlElement;
    }
    onKeyDown(event) {
        switch (event.keyCode) {
            case 37:
                this.speed = this.speedLeft;
                this._htmlElement.classList.add("characterLeft");
                this._htmlElement.classList.remove("characterRight");
                break;
            case 39:
                this.speed = this.speedRight;
                this._htmlElement.classList.add("characterRight");
                this._htmlElement.classList.remove("characterLeft");
                break;
        }
    }
    onKeyUp(event) {
        switch (event.keyCode) {
            case 37:
                this.speed = 0;
                this._htmlElement.classList.remove("characterLeft");
                break;
            case 39:
                this.speed = 0;
                this._htmlElement.classList.remove("characterRight");
                break;
        }
    }
}
