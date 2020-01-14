import { Game } from './game.js';
export class Start {
    constructor() { }
    static getInstance() {
        if (!this.instance) {
            this.instance = new Start();
        }
        return this.instance;
    }
    show() {
        this.start = document.createElement('div');
        this.start.classList.add('start');
        this.container = document.createElement('div');
        this.container.classList.add('intro-container');
        this.start.appendChild(this.container);
        this.headerIntro = document.createElement('h1');
        this.headerIntro.classList.add('header-intro');
        this.headerIntro.innerText = "KMar Brandstof game";
        this.container.appendChild(this.headerIntro);
        this.introText = document.createElement('span');
        this.introText.classList.add('intro-text');
        this.introText.innerText = "In deze game ga je proberen zoveel mogelijk benzine en banden te vangen. Je kunt naar links, rechts, boven en beneden lopen met de pijltoetsen Kijk uit dat het aambeeld niet op je hoofd valt, dan kan je namelijk een aantal seconde niet meer bewegen.";
        this.container.appendChild(this.introText);
        this.button = document.createElement('button');
        this.button.classList.add('button');
        this.button.innerText = "Start";
        this.container.appendChild(this.button);
        this.button.addEventListener("click", () => {
            this.hide();
            Game.getInstance().start();
        }, false);
        document.body.appendChild(this.start);
    }
    hide() {
        document.body.removeChild(this.start);
    }
}
