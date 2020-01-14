export class Car {
    constructor() {
        this.x = -300;
        this.done = false;
        this.speedX = 0;
        this.speedY = 0;
        this.canGoLeft = true;
        this.canGoRight = true;
        this.posX = 0;
        this.posY = 0;
        this.hit = false;
        this._element = document.createElement('div');
        this._element.classList.add('car');
        document.body.appendChild(this._element);
        this.posX = 0;
        this.posY = 0;
        window.addEventListener('keydown', (e) => this.onKeyDown(e));
        window.addEventListener('keyup', (e) => this.onKeyUp(e));
    }
    onKeyDown(e) {
        switch (e.keyCode) {
            case 37:
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
                if (!this.canGoRight) {
                    this.speedX = 0;
                }
                if (!this.canGoLeft) {
                    this.speedX = 0;
                }
                break;
            case 40:
                this.speedY = 15;
                if (!this.canGoRight) {
                    this.speedX = 0;
                }
                if (!this.canGoLeft) {
                    this.speedX = 0;
                }
                break;
            case 39:
                if (this.canGoRight) {
                    this.speedX = 15;
                    this._element.classList.add('carright');
                }
                else {
                    this.speedX = 0;
                }
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
        const blockRight = document.querySelector('.block-right');
        this.canGoRight = this._element.getBoundingClientRect().right < blockRight.getBoundingClientRect().left - 20;
        const blockLeft = document.querySelector('.block-left');
        this.canGoLeft = this._element.getBoundingClientRect().left > blockLeft.getBoundingClientRect().right + 20;
        this.posX += this.speedX;
        this.posY += this.speedY;
        this._element.style.transform = `translate(${this.posX}px, ${this.posY}px)`;
        this.drive();
    }
}
