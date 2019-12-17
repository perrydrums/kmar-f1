export class Message {
    constructor(message, subtitle, extraClass) {
        this.message = message;
        this.subtitle = subtitle;
        this.extraClass = extraClass;
        this.show();
        setTimeout(() => this.hide(), 5000);
    }
    show() {
        this.element = document.createElement('div');
        this.element.classList.add('message');
        this.element.classList.add(this.extraClass);
        this.element.innerHTML = '<h1>' + this.message + '</h1><p>' + this.subtitle + '</p>';
        document.body.appendChild(this.element);
    }
    hide() {
        this.element.remove();
    }
}
