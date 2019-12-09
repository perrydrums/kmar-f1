import { Car } from "./car.js"
import { Dialog } from "./dialog.js"

export class Game {

  private static _instance:Game;

  /**
   * The speed, in frames per second, the game runs at.
   */
  private _fps:number = 30;

  private _fpsInterval:number;

  private _then:number;

  public _car:Car;
  
  private _carTime:number = 0;
  
  private running:boolean = false;
  
  private dialog:Dialog;

  public sequenceCount:number = 0;

  public socket: SocketIOClient.Socket;

  /**
   * Make the constructor private.
   */
  private constructor() {
      this._fpsInterval = 1000 / this._fps;
      this._then = Date.now();

      this.socket = io({ timeout: 60000 });

      this.socket.emit('aero:start', {
        uuid: this.getCookie('uuid'),
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

  public startGame():void {
    this.running = true;
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
        
        this.checkCar();
          
        // Get ready for next frame by setting then=now, but...
        // Also, adjust for fpsInterval not being multiple of 16.67
        this._then = now - (elapsed % this._fpsInterval);
      }
    }
    else {
      if (!this.dialog) {
        this.dialog = Dialog.getInstance();
        this.dialog.setHTML(
          '<h1>KMar F1 - Aerodynamica</h1>' +
          '<p>Jij bent verantwoordelijk voor de pitstop. Probeer de snelste tijd neer te zetten.</p>' +
          '<p>Beweeg met de pijltjestoetsen en pak spullen vast met de spatiebalk.</p>' +
          '<p>Zet de banden op de auto en vul de auto met benzine.</p>'
        );
        this.dialog.addButton();
      }
    }
  }

  public boost() {
    this.socket.emit('aero:boost');
  }

    /**
   * Check if the car's ready.
   */
  private checkCar() {
    if (this._carTime > this._fps * 1) {
      if (!this._car) {
        this._car = new Car();
      }
      this._carTime = 0;
    }
    this._carTime ++;

    if (this._car) {
      this._car.update();

      if (this._car.done) {
        this._car = null;
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