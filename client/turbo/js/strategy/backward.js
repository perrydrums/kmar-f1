export class Backward {
    constructor(c) {
        this.car = c;
    }
    update() {
        this.car.bounce(1);
        this.car.posx += this.car.speed;
        this.car.element.style.transform = `translate(${this.car.posx}px, ${this.car.posy}px)`;
        if ((this.car.last + 1000) < Date.now()) {
            this.car.speed--;
            this.car.last = Date.now();
        }
    }
}
