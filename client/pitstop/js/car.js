export class Car {
    constructor() {
        this.gas = 0;
        this.y = -300;
        this.tires = [];
        this.done = false;
        this._element = document.createElement('div');
        this._element.classList.add('car');
        document.body.appendChild(this._element);
        this.gasmeterElement = document.createElement('div');
        this.gasmeterElement.classList.add('car-gasmeter');
        this._element.appendChild(this.gasmeterElement);
        this.gasmeterElementInner = document.createElement('div');
        this.gasmeterElementInner.classList.add('car-gasmeter-inner');
        this.gasmeterElement.appendChild(this.gasmeterElementInner);
    }
    enter() {
        if (this.y < 300) {
            this.y += 50;
            this._element.style.top = this.y + 'px';
        }
    }
    leave() {
        if (this.y < 1200) {
            this.y += 50;
            this._element.style.top = this.y + 'px';
        }
        else {
            this._element.remove();
            this.done = true;
        }
    }
    update() {
        if (this.tires.length < 4 || this.gas < 80) {
            this.enter();
        }
        else {
            this.leave();
        }
        this.gasmeterElementInner.style.height = this.gas + 'px';
        const red = 100;
        const green = this.gas * 5;
        this.gasmeterElementInner.style.backgroundColor = `rgba(${red}, ${green}, 0, 1)`;
    }
    addTire(tire) {
        this.tires.push(tire);
    }
    fill() {
        this.gas++;
    }
}
