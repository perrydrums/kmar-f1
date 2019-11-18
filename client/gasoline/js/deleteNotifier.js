import { Game } from './game.js';
export class DeleteNotifier {
    constructor() {
        this.observers = [];
    }
    subscribe(c) {
        this.observers.push(c);
    }
    unsubscribe(c) {
        this.observers.splice(this.observers.indexOf(c), 1);
    }
    update() {
        if (Game.getInstance().powerup) {
            for (let c of this.observers) {
                c.notify();
            }
            Game.getInstance().powerup = false;
        }
    }
}
