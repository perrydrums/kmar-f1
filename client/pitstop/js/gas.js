export class Gas {
    constructor() {
        this.element = document.getElementById('game-gasmeter');
        this.amount = 100;
    }
    update() {
        const height = (this.amount * 4.8) + 'px';
        const innerElement = document.getElementById('game-gasmeter-inner');
        innerElement.style.height = height;
    }
    drain() {
        this.amount--;
    }
    reset() {
        this.amount = 100;
    }
}
