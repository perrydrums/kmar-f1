import { Car } from "./car.js"
import { Opponent } from "./opponent.js"
import { Dialog } from "./dialog.js"
import { Pitstop } from "./pitstop.js";
import {Boost} from "./boost.js";

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

  private opponentHit:HTMLElement;

  public sequenceCount:number = 0;

  public opponent:Opponent[] = [];

  public socket: SocketIOClient.Socket;

  private inPitstop:boolean = false;

  private pitstopObject:Pitstop;

  public startTime:number;

  public distance:number = 0;

  public speed:number = 1;

  private lap:number = 1;

  private lapTime:any = {};

  private scoreElement:HTMLElement;
  private distanceElement:HTMLElement;

  private currentBoost:Boost;

  /**
   * Make the constructor private.
   */
  private constructor() {
      this._fpsInterval = 1000 / this._fps;
      this._then = Date.now();
      this.createCar();

      this.startTime = Date.now();

      this.socket = io({ timeout: 60000 });

      this.socket.emit('driver:start', {
        uuid: this.getCookie('uuid'),
      });

      this.socket.on('server:aero:boost', (data:any) => {
          new Boost('Aerodynamische boost!', '+ 10% snelheid');
          this.speed += .1;
      });

      this.socket.on('server:pitstop:done', (data:any) => {
        this.lap ++;
        this.startTime = Date.now();
        this.scoreElement.innerText = this.lap.toString();
        this.inPitstop = false;
        this.pitstopObject.hide();
        this.pitstopObject = null;
      });

      this.scoreElement = document.createElement('div');
      this.scoreElement.classList.add('lap');
      this.scoreElement.innerText = this.lap.toString();
      document.body.appendChild(this.scoreElement);

      this.distanceElement = document.createElement('div');
      this.distanceElement.classList.add('distance');
      document.body.appendChild(this.distanceElement);

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

    if (this.inPitstop) {
      this.pitstopObject = Pitstop.getInstance();
      this.pitstopObject.show();
      return;
    }

    // Calculate elapsed time.
    const now = Date.now();
    const elapsed = now - this._then;

    if (this.running) {
      // If enough time has elapsed, draw the next frame.
      if (elapsed > this._fpsInterval) {
        this.checkCollision();
        this._car.update();

        for (let o of this.opponent) {
          o.update()
        }

        if (this.opponent.length <= 2 ) {
          for (let opponent of this.spawnOpponent(2)) {
              this.opponent.push(opponent)
          }
        }

        this.distance += this.speed;
        this.distanceElement.innerText = this.distance < 1000 ? (1000 - this.distance).toFixed(0).toString() : '0';

        if (this.distance > 1000) {
          this.pitstop();
          this.distance = 0;
        }

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

  private spawnOpponent(amount:number):Opponent[] {
    let opponent:Opponent[] = [];
    for (let i = 0; i < amount; i ++) {
      opponent.push(new Opponent())
    }
    return opponent;
}

    /**
   * Create caracter
   */
  private createCar() {
    this._car = new Car();
  }

  private pitstop() {
    this.lapTime[this.lap] = Date.now() - this.startTime;
    console.log(this.lapTime);
    this.socket.emit('driver:pitstop');
    this.inPitstop = true;
  }

  private checkCollision() {
      for (let i = 0; i < this.opponent.length; i++) {
          if (
              this._car._element.getBoundingClientRect().left < this.opponent[i].element.getBoundingClientRect().right &&
              this._car._element.getBoundingClientRect().right > this.opponent[i].element.getBoundingClientRect().left &&
              this._car._element.getBoundingClientRect().bottom > this.opponent[i].element.getBoundingClientRect().top &&
              this._car._element.getBoundingClientRect().top < this.opponent[i].element.getBoundingClientRect().bottom
          ) {
              if (!document.querySelector('.opponentHit')) {
                  this.opponentHit = document.createElement('div');
                  this.opponentHit.classList.add('opponentHit');
                  document.body.appendChild(this.opponentHit);
                  this.opponentHit.style.transform = `translate(${this._car.posX - 80}px, ${this._car.posY - 200}px)`;
                  setTimeout(() => {
                      this.opponentHit.remove();
                      this._car.hit = false
                  }, 5000);
              }
          }
      }
  }

    /**
   * Check if the car's ready.
   */
  private checkCar() {
    if (this._carTime > this._fps * 0) {
      if (!this._car) {
        this._car = new Car();
            this.opponentHit.style.transform = `translate(${this._car.posX - 80}px, ${this._car.posY}px)`;
            setTimeout(()=> { this.opponentHit.classList.remove('opponentHit'); this.opponentHit.remove(); console.log('timeout klaar'); }, 4000);
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
    return null;
  }

}

window.addEventListener("load", () => {
  Game.getInstance()
});
