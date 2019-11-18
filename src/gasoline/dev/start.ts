import { Game } from './game.js';

export class Start {

    private static instance: Start
    private start:HTMLElement
    private container:HTMLElement
    private button:HTMLElement
    private headerIntro:HTMLElement
    private introText:HTMLElement

    private constructor() {}

    public static getInstance() {
        if (!this.instance) {
            this.instance = new Start()
        }
        return this.instance
    }

    public show() {
        this.start = document.createElement('div')
        this.start.classList.add('start')

        this.container = document.createElement('div')
        this.container.classList.add('intro-container')
        this.start.appendChild(this.container)

        this.headerIntro = document.createElement('h1')
        this.headerIntro.classList.add('header-intro')
        this.headerIntro.innerText = "KMar Brandstof game"
        this.container.appendChild(this.headerIntro)

        this.introText = document.createElement('span')
        this.introText.classList.add('intro-text')
        this.introText.innerText = "In deze game ga je proberen zoveel mogelijk benzine te vangen. Doe dit door de pijltoetsen te gebruiken. Kijk uit dat het aanbeeld niet op je hoofd valt, dan verlies je namelijk de helft van je verzamelde benzine."
        this.container.appendChild(this.introText)

        this.button = document.createElement('button')
        this.button.classList.add('button')
        this.button.innerText = "Start"
        this.container.appendChild(this.button)

        this.button.addEventListener("click", () => {
            this.hide()
            Game.getInstance().start();
        }, false);

        document.body.appendChild(this.start);
    }

    // playAudio(){
    //     let audio = new Audio();
    //     audio.src = "audio/soundtrack.mp3";
    //     audio.load();
    //     audio.play();
    // }

    public hide() {
        document.body.removeChild(this.start);
        // this.playAudio();
    }
}