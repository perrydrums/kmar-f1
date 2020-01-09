import { Anvil } from './anvil.js';
import { Walking } from './walking.js';
import { StopWalking } from './stopWalking.js';
import { Game } from './game.js';
export class Character {
    constructor() {
        this.speed = 0;
        this.speedRight = 5;
        this.speedLeft = -5;
        this.hit = false;
        this.characterLane = 1;
        this._htmlElement = document.createElement("div");
        document.body.appendChild(this.htmlElement).className = "character";
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
        this.noPowerup();
        this.htmlElement.style.transform = `translate(${this.posx += this.speed}px, ${this.posy}px)`;
        if (this.characterLane === 1) {
            this.htmlElement.style.zIndex = "999";
            this.htmlElement.style.height = "210px";
            this.htmlElement.style.width = "150px";
        }
        else if (this.characterLane === 2) {
            this.htmlElement.style.zIndex = "998";
            this.htmlElement.style.height = "180px";
            this.htmlElement.style.width = "130px";
        }
        else {
            this.htmlElement.style.zIndex = "997";
            this.htmlElement.style.height = "160px";
            this.htmlElement.style.width = "120px";
        }
        for (let i = 0; i < this.food.length; i++) {
            if (this.htmlElement.getBoundingClientRect().left < this.food[i].element.getBoundingClientRect().right &&
                this.htmlElement.getBoundingClientRect().right > this.food[i].element.getBoundingClientRect().left &&
                this.htmlElement.getBoundingClientRect().bottom > this.food[i].element.getBoundingClientRect().top &&
                this.htmlElement.getBoundingClientRect().top < this.food[i].element.getBoundingClientRect().bottom) {
                if (this.food[i].lane === 1 && this.characterLane === 1) {
                    if (this instanceof Anvil) {
                        this.subject.unsubscribe(this);
                    }
                    this.food[i].action();
                    this.food[i].remove();
                    Game.getInstance().food.splice(i, 1);
                }
                else if (this.food[i].lane === 2 && this.characterLane === 2) {
                    if (this instanceof Anvil) {
                        this.subject.unsubscribe(this);
                    }
                    this.food[i].action();
                    this.food[i].remove();
                    Game.getInstance().food.splice(i, 1);
                }
                else if (this.food[i].lane === 3 && this.characterLane === 3) {
                    if (this instanceof Anvil) {
                        this.subject.unsubscribe(this);
                    }
                    this.food[i].action();
                    this.food[i].remove();
                    Game.getInstance().food.splice(i, 1);
                }
            }
        }
        if (this.posx >= window.innerWidth - 120) {
            this.speedRight = 0;
        }
        if (this.posx <= 0) {
            this.speedLeft = 0;
        }
    }
    noPowerup() {
        if (!this.hit) {
            this.behaviour = new Walking(this);
        }
        else {
            this.behaviour = new StopWalking(this);
        }
    }
    get htmlElement() {
        return this._htmlElement;
    }
    onKeyDown(event) {
        switch (event.keyCode) {
            case 37:
                event.preventDefault();
                this.speed = this.speedLeft;
                this._htmlElement.classList.add("characterLeft");
                this._htmlElement.classList.remove("characterRight");
                break;
            case 38:
                event.preventDefault();
                if (!this.hit) {
                    if (this.characterLane != 3) {
                        this.characterLane += 1;
                        this.posy -= 80;
                    }
                    else {
                        this.posy -= 0;
                    }
                }
                break;
            case 39:
                event.preventDefault();
                this.speed = this.speedRight;
                this._htmlElement.classList.add("characterRight");
                this._htmlElement.classList.remove("characterLeft");
                break;
            case 40:
                event.preventDefault();
                if (!this.hit) {
                    if (this.characterLane != 1) {
                        this.characterLane -= 1;
                        this.posy += 80;
                    }
                    else {
                        this.posy += 0;
                    }
                }
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
