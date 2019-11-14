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
        this.amount--;
    }
    reset() {
    }
    addGasoline(amount) {
        console.log('PITSTOP: ADD GAS', amount);
        if (this.amount < 100) {
            this.amount += amount;
            if (this.amount >= 100) {
                this.amount = 100;
            }
        }
        console.log('AMOUNT', this.amount);
    }
}
