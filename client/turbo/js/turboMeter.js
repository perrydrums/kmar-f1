import { MasherGame } from "./masherGame.js";
export class TurboMeter {
    constructor() {
        this.amount = 0;
        this.add = (event) => {
            if (event.keyCode === 32) {
                this.amount += 5;
            }
        };
        document.addEventListener('keyup', this.add);
    }
    show() {
        this.element = document.createElement('div');
        this.element.classList.add('turbo-meter');
        this.innerElement = document.createElement('div');
        this.innerElement.classList.add('turbo-meter-inner');
        this.element.appendChild(this.innerElement);
        MasherGame.getInstance().getElement().appendChild(this.element);
    }
    update() {
        this.innerElement.style.width = 100 - this.amount + '%';
        if (this.amount >= 100) {
            this.innerElement.style.width = '0';
            this.element.style.animation = 'blink .3s infinite';
            return true;
        }
        if (this.amount > 0) {
            this.amount -= 0.3;
        }
        return false;
    }
}
