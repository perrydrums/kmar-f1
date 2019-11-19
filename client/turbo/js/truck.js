import { Vehicle } from './vehicle.js';
export class Truck extends Vehicle {
    constructor(s) {
        super();
        this.speedSubject = s;
        this.speedSubject.subscribe(this);
        this.element = document.createElement("truck");
        let foreground = document.getElementsByTagName("foreground")[0];
        foreground.appendChild(this.element);
        this.posy = 500;
    }
    notify(p) {
        this.posx += p;
        this.element.style.transform = `translate(${this.posx}px, ${this.posy}px)`;
    }
}
