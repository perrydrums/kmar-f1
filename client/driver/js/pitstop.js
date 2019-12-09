export class Pitstop {
    constructor() {
        this.overlay = document.createElement('div');
        this.overlay.classList.add('overlay');
        document.body.appendChild(this.overlay);
        this.element = document.createElement('div');
        this.element.classList.add('pitstop');
        this.overlay.appendChild(this.element);
        this.element.innerText = 'IN DE PITSTOP!';
    }
    static getInstance() {
        if (!this._instance) {
            this._instance = new Pitstop();
        }
        return this._instance;
    }
    hide() {
        this.element.remove();
        this.overlay.remove();
    }
}
