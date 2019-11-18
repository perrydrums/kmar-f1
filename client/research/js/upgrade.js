import { Puzzle } from './puzzle.js';
export class Upgrade {
    constructor() { }
    static getInstance() {
        if (!this.instance) {
            this.instance = new Upgrade();
        }
        return this.instance;
    }
    show() {
        this.start = document.createElement('div');
        this.start.classList.add('container');
        document.body.appendChild(this.start);
        this.btnContainer = document.createElement('div');
        this.btnContainer.classList.add('btn-container');
        this.start.appendChild(this.btnContainer);
        this.button1 = document.createElement('button');
        this.button1.classList.add('button-upgrade');
        this.button1.innerText = "Upgrade 1";
        this.btnContainer.appendChild(this.button1);
        this.button2 = document.createElement('button');
        this.button2.classList.add('button-upgrade');
        this.button2.innerText = "Upgrade 2";
        this.btnContainer.appendChild(this.button2);
        this.button3 = document.createElement('button');
        this.button3.classList.add('button-upgrade');
        this.button3.innerText = "Upgrade 3";
        this.btnContainer.appendChild(this.button3);
        this.button4 = document.createElement('button');
        this.button4.classList.add('button-upgrade');
        this.button4.innerText = "Upgrade 4";
        this.btnContainer.appendChild(this.button4);
        this.button1.addEventListener("click", () => {
            this.clickHandler();
        });
    }
    clickHandler() {
        Puzzle.getInstance().show();
    }
}
