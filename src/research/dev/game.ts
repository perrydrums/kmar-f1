import { Dialog } from './dialog.js'
import { UpgradeScreen } from './upgradeScreen.js'
import { Puzzle } from './puzzle.js';
import { Upgrade } from './upgrade.js';

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

  private upgrade:UpgradeScreen;

  private puzzle:Puzzle;

  private socket:SocketIOClient.Socket;

  public completed:any = {};

  /**
   * Make the constructor private.
   */
  private constructor() {
      this._fpsInterval = 1000 / this._fps;
      this._then = Date.now();
      this.upgrade = UpgradeScreen.getInstance();
      this.upgrade.show();

      this.socket = io();

      this.socket.emit('research:start', {
        uuid: this.getCookie('uuid'),
      });

      // Update the buttons if they're unlocked.
      this.socket.on('server:research:update', (data:any) => {
        this.completed = data.upgrades;
      });

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

  public newPuzzle(upgrade:Upgrade):void {    
    this.puzzle = new Puzzle(upgrade);
    this.puzzle.show();
  }

  /**
   * Unlocks the upgrade of set level.
   * 
   * @param {Upgrade} upgrade 
   */
  public unlock(upgrade:Upgrade):void {
    this.completed[upgrade.getName()] = true;
    upgrade.unlockButton();

    this.socket.emit('research:unlock', { upgrade: upgrade.getName() });
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

  /**
   * Get cookie by name.
   * 
   * @param name 
   */
  private getCookie(name:string) {
    const value = "; " + document.cookie;
    const parts = value.split("; " + name + "=");
    if (parts.length == 2) return parts.pop().split(";").shift();
  }

}

window.addEventListener("load", () => {
  Game.getInstance()
});