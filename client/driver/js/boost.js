export class Boost {
    constructor(message) {
        this.message = message;
    }
    show() {
        this.element = document.createElement('div');
        this.element.classList.add('boost');
        this.element.innerText = this.message;
        document.body.appendChild(this.element);
    }
    hide() {
        this.element.remove();
    }
}
