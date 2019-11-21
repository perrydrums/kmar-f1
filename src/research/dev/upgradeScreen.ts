import { Game } from './game.js';
import { Upgrade } from './upgrade.js';

export class UpgradeScreen {

    private static instance: UpgradeScreen;
    private start:HTMLElement;
    private upgrades:Upgrade[] = [];
    private btnContainer:HTMLElement;

    private constructor() {}

    public static getInstance() {
        if (!this.instance) {
            this.instance = new UpgradeScreen();
        }
        return this.instance;
    }

    public show() {
        this.start = document.createElement('div');
        this.start.classList.add('container');
        document.body.appendChild(this.start);

        this.btnContainer = document.createElement('div');
        this.btnContainer.classList.add('btn-container');
        this.start.appendChild(this.btnContainer);

        this.upgrades.push(new Upgrade(1, 'rain-tires', 'Regenbanden', 3));
        this.upgrades.push(new Upgrade(2, 'upgrade2', 'Upgrade 2', 4));
        this.upgrades.push(new Upgrade(3, 'upgrade3', 'Upgrade 3', 5));
        this.upgrades.push(new Upgrade(4, 'upgrade4', 'Upgrade 4', 6));
    }

    public getButtonContainer() {
      return this.btnContainer;
    }
}