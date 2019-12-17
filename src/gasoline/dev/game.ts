import { Character } from './character.js';
import { Food } from './food.js';
import { Subject } from './subject.js';
import { DeleteNotifier } from './deleteNotifier.js';
import { Anvil } from './anvil.js';
import { Tire } from './tire.js';
import { RainTire } from './rainTire.js';
import { Fuel } from './fuel.js';
import { Start } from './start.js';

export class Game {
    private static instance: Game;
    public character: Character;
    private score: number = 0;
    private scoreElement: HTMLElement;
    public food:Food[] = [];
    public powerup:boolean = false;
    public subject:Subject = new DeleteNotifier();
    public socket:SocketIOClient.Socket;
    private rainTiresUnlocked:boolean = false;

    /**
     * The speed, in frames per second, the game runs at.
     */
    private _fps:number = 30;

    private _fpsInterval:number;

    private _then:number;

    private constructor() {}

    public initialize(){
        // this.scoreElement = document.createElement('div');
        // this.scoreElement.classList.add('score');
        // document.body.appendChild(this.scoreElement);
        Start.getInstance().show();
        this.socket = io({ timeout: 60000 });

        this._fpsInterval = 1000 / this._fps;
        this._then = Date.now();

        this.socket.emit('gasoline:start', {
          uuid: this.getCookie('uuid'),
        });

        this.socket.on('server:gasoline:upgrades', (data:any) => {
          if (data.upgrades['rain-tires']) this.rainTiresUnlocked = true;
        });

        this.socket.on('server:research:unlock:rain-tires', (data:any) => {
          this.rainTiresUnlocked = true;
        });
    }

    public start() {
        this.food = this.createFood(4);
        this.character = new Character();
        this.gameLoop();
    }

    public static getInstance() {
        if (! Game.instance) {
            Game.instance = new Game();
        }
        return Game.instance;
    }

    public addScore(amount:number) {

      this.socket.emit('gasoline:update', {gasoline: amount});

        if (amount === 0) {
            this.score = Math.round(this.score / 2);
            // this.scoreElement.classList.remove("fullScore");
        } else if(this.score >= 150) {
                this.score = 150;
                // this.scoreElement.classList.add("fullScore");
        } else {
            // this.scoreElement.classList.remove("fullScore");
            Math.round(this.score += amount);
        }
    }

    public addTire(rainTire:boolean = false) {
      if (rainTire) {
        this.socket.emit('gasoline:update', {rainTire: true});
      } else {
        this.socket.emit('gasoline:update', {tire: true});
      }
    }

    private showScore() {
        // this.scoreElement.innerHTML = "Benzine: " + this.score.toString() + "L";
    }

    private gameLoop() {
        // Calculate elapsed time.
        const now = Date.now();
        const elapsed = now - this._then;

        if (elapsed > this._fpsInterval) {

            this.character.update();
            this.subject.update();

            for(let f of this.food){
                f.update()
            }

            if(this.food.length <= 6){
                for (let food of this.createFood(1)) {
                    this.food.push(food)
                }
            }

            // Get ready for next frame by setting then=now, but...
            // Also, adjust for fpsInterval not being multiple of 16.67
            this._then = now - (elapsed % this._fpsInterval);
        }

        requestAnimationFrame(() => this.gameLoop())
    }

    private createFood(amount:number):Food[] {
        let food:Food[] = [];
        for (let i = 0; i < amount; i ++) {
            const random = Math.floor(Math.random() * 100);
            
            if (random > 0 && random < 45) {
                let randomLane = Math.floor(Math.random() * 3) + 1;
                food.push(new Anvil(this.subject, randomLane));
            }
            else if (random > 45 && random < 75) {
                let randomLane = Math.floor(Math.random() * 3) + 1;
                food.push(new Tire(randomLane));
            }
            else if (random > 75 && random < 90 && this.rainTiresUnlocked) {
                let randomLane = Math.floor(Math.random() * 3) + 1;
                food.push(new RainTire(randomLane));
            }
            else {
                let randomLane = Math.floor(Math.random() * 3) + 1;
                food.push(new Fuel(randomLane));
            }
        }
        return food;
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

window.addEventListener("load", ()=> {
    const g = Game.getInstance()
    g.initialize()
})
