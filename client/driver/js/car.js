export class Car {
    constructor() {
        this.x = -300;
        this.done = false;
        this.correct = false;
        this.sequences = [];
        this.currentSequence = [];
        this.speedX = 0;
        this.speedY = 0;
        this.speedLeft = -15;
        this.speedRight = 15;
        this.canGoLeft = true;
        this.posX = 0;
        this.posY = 0;
        this._element = document.createElement('div');
        this._element.classList.add('car');
        document.body.appendChild(this._element);
        window.addEventListener('keydown', (e) => this.onKeyDown(e));
        window.addEventListener('keyup', (e) => this.onKeyUp(e));
    }
    onKeyDown(e) {
        switch (e.keyCode) {
            case 37:
                console.log('cgl', this.canGoLeft);
                if (this.canGoLeft) {
                    this.speedX = -15;
                    this._element.classList.add('carleft');
                }
                else {
                    this.speedX = 0;
                }
                break;
            case 38:
                this.speedY = -15;
                break;
            case 40:
                this.speedY = 15;
                break;
            case 39:
                this.speedX = 15;
                this._element.classList.add('carright');
                break;
        }
    }
    onKeyUp(e) {
        switch (e.keyCode) {
            case 37:
            case 39:
                this.speedX = 0;
                this._element.classList.remove('carleft');
                this._element.classList.remove('carright');
                break;
            case 38:
            case 40:
                this.speedY = 0;
                break;
        }
    }
    drive() {
    }
    update() {
        let blockRight = document.querySelector('.block-right');
        if (this._element.getBoundingClientRect().right > blockRight.getBoundingClientRect().left) {
            this.speedRight = 0;
        }
        else {
            this.speedRight = 15;
        }
        let blockLeft = document.querySelector('.block-left');
        if (this._element.getBoundingClientRect().left < blockLeft.getBoundingClientRect().right) {
            this.canGoLeft = false;
        }
        else {
            this.canGoLeft = true;
        }
        this._element.style.transform = `translate(${this.posX += this.speedX}px, ${this.posY += this.speedY}px)`;
        this.drive();
    }
}
