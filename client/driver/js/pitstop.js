export class Pitstop {
    constructor() {
        this.visible = false;
    }
    static getInstance() {
        if (!this._instance) {
            this._instance = new Pitstop();
        }
        return this._instance;
    }
    show() {
        if (!this.visible) {
            this.overlay = document.createElement('div');
            this.overlay.classList.add('overlay');
            document.body.appendChild(this.overlay);
            this.element = document.createElement('div');
            this.element.classList.add('pitstop');
            this.overlay.appendChild(this.element);
            this.element.innerText = 'IN DE PITSTOP!';
            this.visible = true;
        }
    }
    hide() {
        this.element.remove();
        this.overlay.remove();
        this.visible = false;
    }
}
