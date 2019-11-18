import { Subject } from './subject.js';
import { Observer } from './observer.js';
import { Game } from './game.js';

export class DeleteNotifier implements Subject{
    observers:Observer [] = []
    
    constructor(){
    }

    public subscribe(c:Observer):void{
        this.observers.push(c);
    }

    public unsubscribe(c:Observer):void {
        this.observers.splice(this.observers.indexOf(c), 1);
    }

    public update():void{
        if (Game.getInstance().powerup) {
            for(let c of this.observers){
                c.notify();
            }
            Game.getInstance().powerup = false;
        }
    }
}