import { TurboMeter } from './turboMeter.js';

export class MasherGame {

    private static instance:MasherGame;
    private element:HTMLElement;
    private button:HTMLElement;
    private turboMeter:TurboMeter;

    private constructor() {

    }

    public static getInstance():MasherGame {
        if (!this.instance) {
            this.instance = new MasherGame();
        }
        return this.instance;
    }

    public show():void {
        this.element = document.createElement('div');
        this.element.classList.add('masher-game-container');
        this.element.innerText = 'Druk op spatiebalk om de turbometer te vullen!';
        document.body.appendChild(this.element);

        this.turboMeter = new TurboMeter();
        this.turboMeter.show();
    }

    public update():boolean {
        if (this.turboMeter.update()) {
            this.button = document.createElement('button');
            this.button.classList.add('turbo-button');
            this.button.innerText = 'TURBO';
            MasherGame.getInstance().getElement().appendChild(this.button);

            return true;
        }

        return false;
    }

    public getElement():HTMLElement {
        return this.element;
    }


}
