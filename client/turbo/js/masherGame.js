import { TurboMeter } from './turboMeter.js';
import { Game } from "./game.js";
export class MasherGame {
    constructor() {
    }
    static getInstance() {
        if (!this.instance) {
            this.instance = new MasherGame();
        }
        return this.instance;
    }
    show() {
        this.element = document.createElement('div');
        this.element.classList.add('masher-game-container');
        this.element.innerText = 'Druk op spatiebalk om de turbometer te vullen!';
        document.body.appendChild(this.element);
        this.turboMeter = new TurboMeter();
        this.turboMeter.show();
    }
    update() {
        if (this.turboMeter.update()) {
            this.button = document.createElement('button');
            this.button.classList.add('turbo-button');
            this.button.innerText = 'TURBO';
            this.button.addEventListener('click', () => Game.getInstance().turbo());
            MasherGame.getInstance().getElement().appendChild(this.button);
            return true;
        }
        return false;
    }
    getElement() {
        return this.element;
    }
}
