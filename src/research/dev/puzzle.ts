import { Peg } from './peg.js';
import { Game } from './game.js';
import { Upgrade } from './upgrade.js';

export class Puzzle {

    private static instance: Puzzle
    private upgrade:Upgrade;

    private start:HTMLElement
    public container:HTMLElement
    public successGif:HTMLElement
    public pegs:Peg[] = [];
    public pegContainer:HTMLElement;
    public pegDiv:HTMLElement;
    public button:HTMLElement;
    private answer:number[] = [];
    private correct:number[] = [];

    constructor(upgrade:Upgrade) {
        this.upgrade = upgrade;

        this.start = document.createElement('div')
        this.start.classList.add('container-puzzle')
        document.body.appendChild(this.start);

        this.container = document.createElement('div')
        this.container.classList.add('inner-container-puzzle')
        this.start.appendChild(this.container)

        this.pegContainer = document.createElement('div')
        this.pegContainer.classList.add('pegContainer')
        this.container.appendChild(this.pegContainer)

        this.pegDiv = document.createElement('div')
        this.container.classList.add('pegs')
        this.container.appendChild(this.pegDiv)

        this.button = document.createElement('button')
        this.button.classList.add('button-submit')
        this.button.innerText = "Submit"
        this.pegDiv.appendChild(this.button)
        this.button.addEventListener('click', () => {
            this.checkAnswer();
        })

        const backButton = document.createElement('button');
        backButton.innerText = 'Terug';
        backButton.addEventListener('click', () => {
            this.hide();
        });
        this.container.appendChild(backButton);
    }

    public show() {
        this.createPegs(this.upgrade.getNumberOfPegs());

        // @TODO: Remove before launch.
        console.log('answer', this.answer);
    }

    public hide() {
        this.start.remove();
        this.container.remove();
        this.pegContainer.remove();
        this.pegDiv.remove();
        this.button.remove();
    }

    /**
     * Create {amount} amount of pegs.
     * 
     * @param {number} amount 
     */
    public createPegs(amount:number) {
        for (let i = 0; i < amount; i ++) {
            const random: number = Math.floor(Math.random() * 4) + 1;
            this.answer.push(random);
            this.pegs.push(new Peg(random));
        }
    }

    /**
     * Check if the answer is correct.
     */
    public checkAnswer() {
        this.pegs.forEach((peg, key) => {
            peg.htmlElement.classList.remove('correct-peg')
            peg.htmlElement.classList.remove('almost-peg')
            peg.htmlElement.classList.remove('wrong-peg')

            if (peg.amount === this.answer[key]) {
                this.correct[key] = 2;
                peg.htmlElement.classList.add('correct-peg')
            }
            else if (this.answer.includes(peg.amount)) {
                this.correct[key] = 1;
                peg.htmlElement.classList.add('almost-peg')
            }
            else {
                this.correct[key] = 0;
                peg.htmlElement.classList.add('wrong-peg')
            }
        });

        if (!(this.correct.includes(0) || this.correct.includes(1))) {
          this.success();
        }
    }

    /**
     * Runs if the puzzle is completed.
     */
    public success(){
        this.successGif = document.createElement('div');
        this.successGif.classList.add('success-gif');
        document.body.appendChild(this.successGif);

        setTimeout(() => {
            this.successGif.remove();
            this.hide();
            Game.getInstance().unlock(this.upgrade);
        }, 2000);
    }
}