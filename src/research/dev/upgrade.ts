import { Puzzle } from './puzzle.js';

export class Upgrade {

    private static instance: Upgrade
    private start:HTMLElement
    private container:HTMLElement
    private button1:HTMLElement
    private button2:HTMLElement
    private button3:HTMLElement
    private button4:HTMLElement
    private btnContainer:HTMLElement

    private constructor() {}

    public static getInstance() {
        if (!this.instance) {
            this.instance = new Upgrade()
            
        }
        return this.instance
    }

    public show() {
        this.start = document.createElement('div')
        this.start.classList.add('container')
        document.body.appendChild(this.start);

        // this.container = document.createElement('div')
        // this.container.classList.add('inner-container')
        // this.start.appendChild(this.container)

        this.btnContainer = document.createElement('div')
        this.btnContainer.classList.add('btn-container')
        this.start.appendChild(this.btnContainer)

        this.button1 = document.createElement('button')
        this.button1.classList.add('button-upgrade')
        this.button1.innerText = "Upgrade 1"
        this.btnContainer.appendChild(this.button1)
        
        this.button2 = document.createElement('button')
        this.button2.classList.add('button-upgrade')
        this.button2.innerText = "Upgrade 2"
        this.btnContainer.appendChild(this.button2)

        this.button3 = document.createElement('button')
        this.button3.classList.add('button-upgrade')
        this.button3.innerText = "Upgrade 3"
        this.btnContainer.appendChild(this.button3)

        this.button4 = document.createElement('button')
        this.button4.classList.add('button-upgrade')
        this.button4.innerText = "Upgrade 4"
        this.btnContainer.appendChild(this.button4)

        this.button1.addEventListener("click", () => {
            this.clickHandler()
        });
    }

    public clickHandler() {
        Puzzle.getInstance().show() 
    }
}