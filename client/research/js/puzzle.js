import { Peg } from './peg.js';
export class Puzzle {
    constructor() {
        this.pegs = [];
        this.answer = [];
        this.correct = [0, 0, 0, 0];
        this.start = document.createElement('div');
        this.start.classList.add('container-puzzle');
        document.body.appendChild(this.start);
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
        this.button.innerText = "Submit";
        this.pegDiv.appendChild(this.button);
        this.button.addEventListener('click', () => {
            this.checkAnswer();
        });
    }
    static getInstance() {
        if (!this.instance) {
            this.instance = new Puzzle();
        }
        return this.instance;
    }
    show() {
        this.createPegs(4);
        console.log('answer', this.answer);
    }
    createPegs(amount) {
        for (let i = 0; i < amount; i++) {
            const random = Math.floor(Math.random() * 4) + 1;
            this.answer.push(random);
            this.pegs.push(new Peg(random));
        }
    }
    checkAnswer() {
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
        if (JSON.stringify(this.correct) === JSON.stringify([2, 2, 2, 2])) {
            this.success();
        }
        console.log('correct', this.correct);
    }
    success() {
        this.successGif = document.createElement('div');
        this.successGif.classList.add('success-gif');
        document.body.appendChild(this.successGif);
    }
}
