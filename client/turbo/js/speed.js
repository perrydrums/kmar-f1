export class Speed {
    constructor() {
        this.observers = [];
        this.speed = 0;
    }
    subscribe(c) {
        this.observers.push(c);
    }
    update() {
        this.speed += 0.0005;
        for (let c of this.observers) {
            c.notify(this.speed);
        }
    }
}
