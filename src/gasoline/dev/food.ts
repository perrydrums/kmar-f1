import { Anvil } from './anvil.js';
import { Game } from './game.js';
import { Tire } from './tire.js';

export class Food {

    protected _element: HTMLElement
    protected _shadowElement: HTMLElement
    public posy:number = -200;
    public posx:number
    protected speed:number
    protected game:Game
    lane:number
    stopLaneHeight:number

    constructor(lane:number) {
        this.lane = lane;

        this.posx = Math.random() * (window.innerWidth - 300);
        this.speed = Math.random() * 5 + 1;

        this.game = Game.getInstance();
    }

    public update():void {
        if(this.lane === 1){
            this.stopLaneHeight = 0;
        } else if(this.lane === 2){
            this.stopLaneHeight = -80;
        } else if(this.lane === 3) {
            this.stopLaneHeight = -160;
        }

        if(this.posy >= window.innerHeight + this.stopLaneHeight){
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
