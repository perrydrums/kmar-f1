export class Boost {
    constructor(message, subtitle) {
        this.message = message;
        this.subtitle = subtitle;
    }
    show() {
        this.element = document.createElement('div');
        this.element.classList.add('boost');
        this.element.innerHTML = '<h1>' + this.message + '</h1><p>' + this.subtitle + '</p>';
        document.body.appendChild(this.element);
    }
    hide() {
        this.element.remove();
    }
}
