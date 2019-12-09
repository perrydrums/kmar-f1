import { Anvil } from './anvil.js';
import { Walking } from './walking.js';
import { StopWalking } from './stopWalking.js';
import { Movement } from './movement.js';
import { Food } from './food.js';
// import { Powerup } from './powerup.js';
import { Game } from './game.js';

export class Character {
    public _htmlElement : HTMLElement
    public posx:number
    public posy:number
    public speed:number = 0
    public behaviour:Movement
    public speedRight:number = 5
    public speedLeft:number = -5
    private food:Food[];
    // public powerup:Powerup
    public hit:boolean = false;
    characterLane:number = 1;

    constructor(){
        this._htmlElement = document.createElement("div")
        document.body.appendChild(this.htmlElement).className = "character";
        // this.powerup = new Powerup(this);
        this.food = Game.getInstance().food;
        this.posx = window.innerWidth / 2 - 100;
        this.posy = window.innerHeight - 150;

        this.htmlElement.style.transform = `translate(${this.posx}px, ${this.posy}px)`;
        this.noPowerup();
        window.addEventListener("keydown", (e:KeyboardEvent) => this.onKeyDown(e));
        window.addEventListener("keyup", (e:KeyboardEvent) => this.onKeyUp(e));
    }

    public update(){
        this.behaviour.update();
        this.noPowerup();
        this.htmlElement.style.transform = `translate(${this.posx += this.speed}px, ${this.posy}px)`;
        console.log(this.characterLane);

        if(this.characterLane === 1){
            this.htmlElement.style.zIndex = "999";
            this.htmlElement.style.height = "200px";
            this.htmlElement.style.width = "150px";
        } else if(this.characterLane === 2){
            this.htmlElement.style.zIndex = "998";
            this.htmlElement.style.height = "180px";
            this.htmlElement.style.width = "130px";
        } else {
            this.htmlElement.style.zIndex = "997";
            this.htmlElement.style.height = "160px";
            this.htmlElement.style.width = "120px";
        }


        for(let i = 0; i < this.food.length; i++){
            if(
                this.htmlElement.getBoundingClientRect().left < this.food[i].element.getBoundingClientRect().right &&
                this.htmlElement.getBoundingClientRect().right > this.food[i].element.getBoundingClientRect().left &&
                this.htmlElement.getBoundingClientRect().bottom > this.food[i].element.getBoundingClientRect().top &&
                this.htmlElement.getBoundingClientRect().top < this.food[i].element.getBoundingClientRect().bottom
            ){
                if(this.food[i].lane === 1 && this.characterLane === 1) {
                    if (this instanceof Anvil) {
                        this.subject.unsubscribe(this);
                    }
                    this.food[i].action();
                    this.food[i].remove();
                    Game.getInstance().food.splice(i, 1);
                } else if (this.food[i].lane === 2 && this.characterLane === 2){
                    
                    if (this instanceof Anvil) {
                        this.subject.unsubscribe(this);
                    }
                    this.food[i].action();
                    this.food[i].remove();
                    Game.getInstance().food.splice(i, 1);
                } else if (this.food[i].lane === 3 && this.characterLane === 3) {
                    
                    if (this instanceof Anvil) {
                        this.subject.unsubscribe(this);
                    }
                    this.food[i].action();
                    this.food[i].remove();
                    Game.getInstance().food.splice(i, 1);
                }
            }
        }

        // if(
        //     this.htmlElement.getBoundingClientRect().left < this.powerup.element.getBoundingClientRect().right &&
        //     this.htmlElement.getBoundingClientRect().right > this.powerup.element.getBoundingClientRect().left &&
        //     this.htmlElement.getBoundingClientRect().bottom > this.powerup.element.getBoundingClientRect().top &&
        //     this.htmlElement.getBoundingClientRect().top < this.powerup.element.getBoundingClientRect().bottom &&
        //     this.powerup.now
        // ){
        //     this.powerup.action();
        //     Game.getInstance().powerup = true;
        // }

        if(this.posx >= window.innerWidth - 120){
            this.speedRight = 0;
        }

        if(this.posx <= 0) {
            this.speedLeft = 0;
        }
    }

    public noPowerup(){
        if(!this.hit){
            this.behaviour = new Walking(this);   
        } else {
            this.behaviour = new StopWalking(this);
        }
    }

    get htmlElement():HTMLElement {
        return this._htmlElement;
    }

    public onKeyDown(event:KeyboardEvent):void {
        switch(event.keyCode){
        case 37:
            event.preventDefault();
            this.speed = this.speedLeft;
            this._htmlElement.classList.add("characterLeft");
            this._htmlElement.classList.remove("characterRight");
            break;
        case 38:
            event.preventDefault();
            if(!this.hit){
                if(this.characterLane != 3){
                    this.characterLane += 1;
                    this.posy -= 50;
                } else {
                    this.posy -= 0;
                }
            }
            break;
        case 39:
            event.preventDefault();
            this.speed = this.speedRight;
            this._htmlElement.classList.add("characterRight");
            this._htmlElement.classList.remove("characterLeft");
            break;
        case 40:
            event.preventDefault();
            if(!this.hit){
                if(this.characterLane != 1){
                    this.characterLane -= 1;
                    this.posy += 50;
                } else {
                    this.posy += 0;
                }
            }
            break;    
        }
    }
    
    public onKeyUp(event:KeyboardEvent):void {
        switch(event.keyCode){
        case 37:
            this.speed = 0;
            this._htmlElement.classList.remove("characterLeft");
            break;
        case 39:
            this.speed = 0;
            this._htmlElement.classList.remove("characterRight");
            break;
        }
    }
}
