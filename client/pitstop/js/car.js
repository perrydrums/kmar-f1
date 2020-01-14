export class Car {
    constructor() {
        this.gas = 0;
        this.y = -300;
        this.tires = [];
        this.done = false;
        this.checkmarks = [];
        this._element = document.createElement('div');
        this._element.classList.add('car');
        document.body.appendChild(this._element);
        for (let i = 0; i < 4; i++) {
            const checkmark = document.createElement('div');
            checkmark.classList.add('checkmark-' + i.toString());
            this._element.appendChild(checkmark);
            this.checkmarks.push(checkmark);
        }
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
        this.gasmeterElementInner.style.height = (this.gas * (50 / 80)) + 'px';
        const red = 100;
        const green = this.gas * 5;
        this.gasmeterElementInner.style.backgroundColor = `rgba(${red}, ${green}, 0, 1)`;
    }
    addTire(tire) {
        this.tires.push(tire);
        const className = '.checkmark-' + (this.tires.length - 1).toString();
        const element = document.querySelector(className);
        element.innerText = '✅';
    }
    fill() {
        this.gas++;
    }
}
