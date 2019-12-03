import { UpgradeScreen } from "./upgradeScreen.js";
import { Game } from "./game.js";

export class Upgrade {

  private level:number;
  private name:string;
  private title:string;
  private numberOfPegs:number;
  private htmlElement:HTMLElement;
  private spanElement:HTMLElement;
  private unlocked:boolean = false;

  constructor(level:number, name:string, title:string, numberOfPegs:number) {
    this.level = level;
    this.name = name;
    this.title = title;
    this.numberOfPegs = numberOfPegs;

    this.htmlElement = document.createElement('button');
    this.htmlElement.classList.add('button-upgrade');    
    this.htmlElement.classList.add('icon-' + this.name);
    this.spanElement = document.createElement('span');
    this.spanElement.innerText = this.title;
    this.htmlElement.appendChild(this.spanElement);

    const btnContainer = UpgradeScreen.getInstance().getButtonContainer();
    btnContainer.appendChild(this.htmlElement);

    this.htmlElement.addEventListener('click', () => {
      this.clickHandler(this)
    });

    // Lock upgrade buttons if the upgrade is unlocked.
    setTimeout(() => this.checkUnlockedUpgrades(), 1000);
  }

  private clickHandler(upgrade:Upgrade) {
    if (!this.unlocked) {
      Game.getInstance().newPuzzle(upgrade);
    }
  }

  /**
   * Mark the upgrade button as UNLOCKED and disable the button.
   */
  public unlockButton():void {
    this.unlocked = true;
    const button:HTMLElement = this.htmlElement;
    button.classList.add('unlocked');
    button.removeEventListener('click', () => {});
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

  public getElement() {
    return this.htmlElement;
  }

}