var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { UpgradeScreen } from "./upgradeScreen.js";
import { Game } from "./game.js";
export class Upgrade {
    constructor(level, name, title, numberOfPegs) {
        this.unlocked = false;
        this.level = level;
        this.name = name;
        this.title = title;
        this.numberOfPegs = numberOfPegs;
        this.htmlElement = document.createElement('button');
        this.htmlElement.classList.add('button-upgrade');
        this.htmlElement.classList.add('icon-' + this.name);
        this.htmlElement.innerText = this.title;
        const btnContainer = UpgradeScreen.getInstance().getButtonContainer();
        btnContainer.appendChild(this.htmlElement);
        this.htmlElement.addEventListener('click', () => {
            this.clickHandler(this);
        });
        setTimeout(() => this.checkUnlockedUpgrades(), 1000);
    }
    clickHandler(upgrade) {
        if (!this.unlocked) {
            Game.getInstance().newPuzzle(upgrade);
        }
    }
    unlockButton() {
        this.unlocked = true;
        const button = this.htmlElement;
        button.classList.add('unlocked');
        button.removeEventListener('click', () => { });
    }
    checkUnlockedUpgrades() {
        return __awaiter(this, void 0, void 0, function* () {
            const unlockedUpgrades = Object.entries(Game.getInstance().completed);
            for (const [upgradeName, hasUpgrade] of unlockedUpgrades) {
                if (upgradeName === this.getName() && hasUpgrade) {
                    this.unlockButton();
                }
            }
        });
    }
    getLevel() {
        return this.level;
    }
    getName() {
        return this.name;
    }
    getTitle() {
        return this.title;
    }
    getNumberOfPegs() {
        return this.numberOfPegs;
    }
    getElement() {
        return this.htmlElement;
    }
}
