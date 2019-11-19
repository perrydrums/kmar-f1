import { Character } from './character.js';
import { Food } from './food.js';
import { Subject } from './subject.js';
import { DeleteNotifier } from './deleteNotifier.js';
import { Anvil } from './anvil.js';
import { Small } from './small.js';
import { Brain } from './brain.js';
import { Start } from './start.js';

export class Game {
    private static instance: Game;
    private character: Character;
    private score: number = 0;
    private scoreElement: HTMLElement;
    public food:Food[] = [];
    public powerup:boolean = false;
    public subject:Subject = new DeleteNotifier();
    public socket:SocketIOClient.Socket;
    
    private constructor() {}
    
    public initialize(){
        this.scoreElement = document.createElement('div');
        this.scoreElement.classList.add('score');
        document.body.appendChild(this.scoreElement);
        Start.getInstance().show();
        this.socket = io({ timeout: 60000 });

        this.socket.emit('gasoline:start', {
          uuid: this.getCookie('uuid'),
        });
    }
    
    public start() {
        this.food = this.createFood(1);
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
            this.scoreElement.classList.remove("fullScore");
        } else if(this.score >= 150) {
                this.score = 150;
                this.scoreElement.classList.add("fullScore");
                alert("Je hebt genoeg benzine verzameld");
                window.location.reload();
        } else {
            this.scoreElement.classList.remove("fullScore");
            Math.round(this.score += amount);
        }
    }

    private showScore() {
        this.scoreElement.innerHTML = "Benzine: " + this.score.toString() + "L";
    }

    private gameLoop() {
        this.character.update();
        this.subject.update();
        this.showScore();
        
        for(let f of this.food){
            f.update()
        }

        if(this.food.length <= 2 ){
            for (let food of this.createFood(2)) {
                this.food.push(food)
            }
        }

        requestAnimationFrame(() => this.gameLoop())
    }

    private createFood(amount:number):Food[] {
        let food:Food[] = [];
        for (let i = 0; i < amount; i ++) {
            const random = Math.floor(Math.random() * 100);
            if (random > 30) {
                food.push(new Anvil(this.subject));
            } else if(random > 60) {
                food.push(new Small());
            }
            else {
                food.push(new Brain());
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