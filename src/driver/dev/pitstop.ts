export class Pitstop {

    private static _instance: Pitstop;
    private element: HTMLElement;
    private overlay: HTMLElement;
    private trackOverlay: HTMLElement;
    private trackOverlay2: HTMLElement;
    private textOverlay: HTMLElement;
    private visible: boolean = false;

    private constructor() {
    }

    /**
     * There can always only be one Dialog instance.
     *
     * @returns {Pitstop}
     */
    public static getInstance(): Pitstop {
        if (!this._instance) {
            this._instance = new Pitstop();
        }
        return this._instance;
    }

    public show() {
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

    public hide() {
        this.element.remove();
        this.overlay.remove();
        this.visible = false;
    }

}
