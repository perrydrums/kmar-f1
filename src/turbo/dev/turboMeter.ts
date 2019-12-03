import {MasherGame} from "./masherGame.js";

export class TurboMeter {

    private element:HTMLElement;
    private innerElement:HTMLElement;
    private amount:number = 0;

    public constructor() {
        document.addEventListener('keyup', this.add);
    }

    public show() {
        this.element = document.createElement('div');
        this.element.classList.add('turbo-meter');

        this.innerElement = document.createElement('div');
        this.innerElement.classList.add('turbo-meter-inner');

        this.element.appendChild(this.innerElement);

        MasherGame.getInstance().getElement().appendChild(this.element)
    }

    public update():boolean {
        // Update element.
        this.innerElement.style.width = 100 - this.amount + '%';

        // Check if bar is full.
        if (this.amount >= 100) {
            this.innerElement.style.width = '0';
            this.element.style.animation = 'blink .3s infinite';
            return true;
        }

        // Decrease amount.
        if (this.amount > 0) {
            this.amount -= 0.3;
        }

        return false;
    }

    public add = (event:KeyboardEvent) => {
        if (event.keyCode === 32) {
            this.amount += 5;
        }
    }

}
