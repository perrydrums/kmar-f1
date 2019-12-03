import { Vehicle } from './vehicle.js';
import { Forward } from './strategy/forward.js';
export class Car extends Vehicle {
    constructor() {
        super();
        this.splitted = [];
        this.currentLetter = 0;
        this.element = document.createElement("car");
        let foreground = document.getElementsByTagName("foreground")[0];
        foreground.appendChild(this.element);
        window.addEventListener("keydown", (e) => this.onKeyDown(e));
        this.check = this.game.generateRandom();
        this.posy = 580;
        this.behavior = new Forward(this);
        this.makeWord();
    }
    makeWord() {
        this.randomWord = this.game.randomWord();
        this.game.setWord(this.randomWord);
    }
    onKeyDown(event) {
        const keyCode = this.randomWord.charAt(this.currentLetter).toUpperCase().charCodeAt(0);
        switch (event.keyCode) {
            case keyCode:
                if (this.currentLetter === this.randomWord.length - 1) {
                    this.currentLetter = 0;
                    this.speed += 0.10;
                    if (this.speed > 0) {
                        this.behavior = new Forward(this);
                    }
                    this.makeWord();
                }
                else {
                    const letterSpans = document.getElementById('word').childNodes;
                    letterSpans[this.currentLetter].classList.add('correct');
                    this.currentLetter++;
                }
                break;
            default: this.speed -= 0.10;
        }
    }
    update() {
        this.behavior.update();
    }
}
