export class Boost {

    private element:HTMLElement;

    private readonly message:string;
    private readonly subtitle:string;

    public constructor(message:string, subtitle:string) {
        this.message = message;
        this.subtitle = subtitle;
    }

    public show() {
        this.element = document.createElement('div');
        this.element.classList.add('boost');
        this.element.innerHTML = '<h1>' + this.message + '</h1><p>' + this.subtitle + '</p>';
        document.body.appendChild(this.element);
    }

    public hide() {
        this.element.remove();
    }


}
