export class Message {

    private element: HTMLElement;
    private readonly message: string;
    private readonly subtitle: string;
    private readonly extraClass: string;

    public constructor(message: string, subtitle: string, extraClass: string) {
        this.message = message;
        this.subtitle = subtitle;
        this.extraClass = extraClass;

        this.show();
        setTimeout(() => this.hide(), 5000);
    }

    public show() {
        this.element = document.createElement('div');
        this.element.classList.add('message');
        this.element.classList.add(this.extraClass);
        this.element.innerHTML = '<h1>' + this.message + '</h1><p>' + this.subtitle + '</p>';
        document.body.appendChild(this.element);
    }

    public hide() {
        this.element.remove();
    }


}
