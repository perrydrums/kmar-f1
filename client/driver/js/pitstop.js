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
            this.trackOverlay = document.createElement('div');
            this.trackOverlay.classList.add('track-overlay');
            this.element.appendChild(this.trackOverlay);
            this.trackOverlay2 = document.createElement('div');
            this.trackOverlay2.classList.add('track-overlay', 'track-overlay--top');
            this.element.appendChild(this.trackOverlay2);
            this.textOverlay = document.createElement('div');
            this.trackOverlay.classList.add('text-overlay');
            this.element.appendChild(this.textOverlay);
            this.textOverlay.innerText = 'IN DE PITSTOP!';
            this.visible = true;
        }
    }
    hide() {
        this.element.remove();
        this.overlay.remove();
        this.visible = false;
    }
}
