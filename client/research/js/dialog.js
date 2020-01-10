export class Dialog {
    constructor() {
        this.overlay = document.createElement('div');
        this.overlay.classList.add('overlay');
        document.body.appendChild(this.overlay);
        this.element = document.createElement('div');
        this.element.classList.add('dialog');
        this.element.classList.add('dialog-start');
        document.body.appendChild(this.element);
    }
    static getInstance() {
        if (!this._instance) {
            this._instance = new Dialog();
        }
        return this._instance;
    }
    setHTML(html) {
        this.element.innerHTML = html;
    }
    addButton() {
        this.button = document.createElement('button');
        this.button.innerText = 'START';
        this.button.onclick = () => {
            Dialog.getInstance().startGame();
        };
        this.element.appendChild(this.button);
    }
    startGame() {
        this.element.remove();
        this.overlay.remove();
    }
}
