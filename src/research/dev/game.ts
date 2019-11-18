import { Dialog } from './dialog.js'
import { Upgrade } from './upgrade.js'

export class Game {

  private static _instance:Game;

  /**
   * The speed, in frames per second, the game runs at.
   */
  private _fps:number = 30;

  private _fpsInterval:number;

  private _then:number;

  private running:boolean = false;

  private dialog:Dialog;

  private upgrade:Upgrade;

  /**
   * Make the constructor private.
   */
  private constructor() {
      this._fpsInterval = 1000 / this._fps;
      this._then = Date.now();
      Upgrade.getInstance().show();

      this.gameLoop();
  }

  /**
   * There can always only be one Game instance.
   * 
   * @returns {Game}
   */
  public static getInstance():Game {
    if (!this._instance) {
      this._instance = new Game();
    }
    return this._instance;
  }

  public startGame():void {
    
  }
  
  /**
   * Runs approx. {this._fps} times a second.
   */
  gameLoop() {
    requestAnimationFrame(() => this.gameLoop());

    // Calculate elapsed time.
    const now = Date.now();
    const elapsed = now - this._then;

    if (this.running) {
      // If enough time has elapsed, draw the next frame.
      if (elapsed > this._fpsInterval) {

        

        // Get ready for next frame by setting then=now, but...
        // Also, adjust for fpsInterval not being multiple of 16.67
        this._then = now - (elapsed % this._fpsInterval);
      }
    }
    else {
      if (!this.dialog) {
        this.dialog = Dialog.getInstance();
        this.dialog.setHTML(
          '<h1>KMar F1 - Research & Development</h1>' +
          '<p>Jij bent verantwoordelijk voor de pitstop. Probeer de snelste tijd neer te zetten.</p>' +
          '<p>Beweeg met de pijltjestoetsen en pak spullen vast met de spatiebalk.</p>' +
          '<p>Zet de banden op de auto en vul de auto met benzine.</p>'
        );
        this.dialog.addButton();
      }
    }
  }

}

window.addEventListener("load", () => {
  Game.getInstance()
});