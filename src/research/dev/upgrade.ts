import {UpgradeScreen} from "./upgradeScreen.js";
import {Game} from "./game.js";

export class Upgrade {

    private readonly level: number;
    private readonly name: string;
    private readonly title: string;
    private readonly numberOfPegs: number;
    private readonly htmlElement: HTMLElement;
    private readonly spanElement: HTMLElement;
    private readonly cost: number;
    private unlocked: boolean = false;

    constructor(level: number, name: string, title: string, numberOfPegs: number, cost: number) {
        this.level = level;
        this.name = name;
        this.title = title;
        this.numberOfPegs = numberOfPegs;
        this.cost = cost;

        this.htmlElement = document.createElement('button');
        this.htmlElement.classList.add('button-upgrade');
        this.htmlElement.classList.add('icon-' + this.name);
        this.spanElement = document.createElement('span');
        this.spanElement.innerHTML = `${title} <small>${cost.toString()}</small>`;
        this.htmlElement.appendChild(this.spanElement);

        const btnContainer = UpgradeScreen.getInstance().getButtonContainer();
        btnContainer.appendChild(this.htmlElement);

        this.htmlElement.addEventListener('click', () => {
            this.clickHandler(this)
        });

        // Lock upgrade buttons if the upgrade is unlocked.
        setTimeout(() => this.checkUnlockedUpgrades(), 1000);
    }

    private clickHandler(upgrade: Upgrade) {
        if (!this.unlocked && Game.getInstance().getTokens() >= this.cost) {
            Game.getInstance().newPuzzle(upgrade);
        }
    }

    /**
     * Mark the upgrade button as UNLOCKED and disable the button.
     */
    public unlockButton(): void {
        this.unlocked = true;
        const button: HTMLElement = this.htmlElement;
        button.classList.add('unlocked');
        button.removeEventListener('click', () => {
        });
    }

    /**
     * Checks if the button should be disabled.
     */
    private async checkUnlockedUpgrades() {
        // Check if the upgrade is already unlocked.
        const unlockedUpgrades = Object.entries(Game.getInstance().completed);
        for (const [upgradeName, hasUpgrade] of unlockedUpgrades) {
            if (upgradeName === this.getName() && hasUpgrade) {
                this.unlockButton();
            }
        }
    }

    public getLevel() {
        return this.level;
    }

    public getName() {
        return this.name;
    }

    public getTitle() {
        return this.title;
    }

    public getNumberOfPegs() {
        return this.numberOfPegs;
    }

    public getCost() {
        return this.cost;
    }

    public getElement() {
        return this.htmlElement;
    }

}
