import { Running } from './running.js';
export class Powerup {
    constructor(character) {
        this.now = true;
        this.character = character;
        this._element = document.createElement("powerup");
        let foreground = document.getElementsByTagName("foreground")[0];
        foreground.appendChild(this._element);
        this.posx = window.innerWidth - 150;
        this.posy = window.innerHeight;
        this._element.style.transform = `translate(${this.posx}px, ${this.posy}px)`;
    }
    action() {
        this.character.behaviour = new Running(this.character);
        setTimeout(() => { this.character.noPowerup(); }, 10000);
        this.changeStatusPlant();
    }
    get element() {
        return this._element;
    }
    changeStatusPlant() {
        this.now = false;
        this.element.classList.add("powerupLoading");
        setTimeout(() => { this.element.classList.remove("powerupLoading"); this.now = true; }, 30000);
    }
}
