import { Peg } from './peg.js';
import { Game } from './game.js';
export class Puzzle {
    constructor(upgrade) {
        this.tryCount = 4;
        this.pegs = [];
        this.answer = [];
        this.correct = [];
        this.upgrade = upgrade;
        this.start = document.createElement('div');
        this.start.classList.add('container-puzzle');
        document.body.appendChild(this.start);
        const backButton = document.createElement('button');
        backButton.classList.add('backButton');
        backButton.innerText = 'Terug';
        backButton.addEventListener('click', () => {
            this.hide();
        });
        this.start.appendChild(backButton);
        this.tryCountContainer = document.createElement('div');
        this.tryCountContainer.classList.add('try-count');
        this.tryCountContainer.innerText = 'Pogingen: ' + this.tryCount;
        this.start.appendChild(this.tryCountContainer);
        this.container = document.createElement('div');
        this.container.classList.add('inner-container-puzzle');
        this.start.appendChild(this.container);
        this.pegContainer = document.createElement('div');
        this.pegContainer.classList.add('pegContainer');
        this.container.appendChild(this.pegContainer);
        this.pegDiv = document.createElement('div');
        this.container.classList.add('pegs');
        this.container.appendChild(this.pegDiv);
        this.button = document.createElement('button');
        this.button.classList.add('button-submit');
        this.button.innerText = "Verzenden";
        this.pegDiv.appendChild(this.button);
        this.button.addEventListener('click', () => {
            this.checkAnswer();
        });
    }
    show() {
        this.createPegs(this.upgrade.getNumberOfPegs());
    }
    hide() {
        this.start.remove();
        this.container.remove();
        this.pegContainer.remove();
        this.pegDiv.remove();
        this.button.remove();
    }
    createPegs(amount) {
        for (let i = 0; i < amount; i++) {
            const random = Math.floor(Math.random() * 4) + 1;
            this.answer.push(random);
            this.pegs.push(new Peg(random));
        }
    }
    checkAnswer() {
        this.tryCount--;
        this.tryCountContainer.innerText = 'Pogingen: ' + this.tryCount;
        if (this.tryCount === 0) {
            this.hide();
        }
        this.pegs.forEach((peg, key) => {
            peg.htmlElement.classList.remove('correct-peg');
            peg.htmlElement.classList.remove('almost-peg');
            peg.htmlElement.classList.remove('wrong-peg');
            if (peg.amount === this.answer[key]) {
                this.correct[key] = 2;
                peg.htmlElement.classList.add('correct-peg');
            }
            else if (this.answer.includes(peg.amount)) {
                this.correct[key] = 1;
                peg.htmlElement.classList.add('almost-peg');
            }
            else {
                this.correct[key] = 0;
                peg.htmlElement.classList.add('wrong-peg');
            }
        });
        if (!(this.correct.includes(0) || this.correct.includes(1))) {
            this.success();
        }
    }
    success() {
        this.successGif = document.createElement('div');
        this.successGif.classList.add('success-gif');
        document.body.appendChild(this.successGif);
        Game.getInstance().spendTokens(this.upgrade.getCost());
        setTimeout(() => {
            this.successGif.remove();
            this.hide();
            Game.getInstance().unlock(this.upgrade);
        }, 2000);
    }
}
