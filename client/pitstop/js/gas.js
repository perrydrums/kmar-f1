export class Gas {
    constructor() {
        this.element = document.getElementById('game-gasmeter');
        this.amount = 0;
    }
    update() {
        const height = (this.amount * 4.8) + 'px';
        const innerElement = document.getElementById('game-gasmeter-inner');
        innerElement.style.height = height;
    }
    drain() {
        if (this.amount > 0) {
            this.amount--;
        }
    }
    reset() {
    }
    addGasoline(amount) {
        if (this.amount < 100) {
            this.amount += amount;
            if (this.amount >= 100) {
                this.amount = 100;
            }
        }
    }
}
