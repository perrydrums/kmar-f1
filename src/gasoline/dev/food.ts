import { Anvil } from './anvil.js';
import { Game } from './game.js';

export class Food {

    protected _element: HTMLElement
    public posy:number = -200;
    public posx:number
    protected speed:number
    protected game:Game
    lane:number

    constructor(lane:number) {
        this.lane = lane;
        
        this.posx = Math.random() * (window.innerWidth - 300);
        this.speed = Math.random() * 5 + 1;

        this.game = Game.getInstance();
    }

    public update():void {
        if(this.posy >= window.innerHeight + 200){
            if (this instanceof Anvil) {
                this.remove();
                this.subject.unsubscribe(this);
            }
            this.remove();
            const index = this.game.food.indexOf(this);
            this.game.food.splice(index, 1);
        } else {
            this.posy += this.speed;
            this._element.style.transform = `translate(${this.posx}px, ${this.posy}px)`
        }
    }

    get element():HTMLElement {
        return this._element;
    }

    public remove(){
        this._element.remove();
    }

    public action(){}
}
