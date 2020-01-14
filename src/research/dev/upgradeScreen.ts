import {Upgrade} from './upgrade.js';

export class UpgradeScreen {

    private static instance: UpgradeScreen;
    private start: HTMLElement;
    private upgrades: Upgrade[] = [];
    private btnContainer: HTMLElement;

    private constructor() {
    }

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

        this.upgrades.push(new Upgrade(1, 'rain-tires', 'Regenbanden', 3, 1));
        this.upgrades.push(new Upgrade(2, 'engine-upgrade', 'Motor', 4, 2));
        this.upgrades.push(new Upgrade(3, 'turbo-upgrade', 'Turbo', 4, 2));
        this.upgrades.push(new Upgrade(4, 'aero-upgrade', 'Aerodynamica', 5, 2));
        this.upgrades.push(new Upgrade(5, 'fuel-upgrade', 'Super brandstof', 6, 3));
    }

    public getButtonContainer() {
        return this.btnContainer;
    }
}
