export class Boost {

    private element:HTMLElement;

    private readonly message:string;

    public constructor(message:string) {
        this.message = message;
    }

    public show() {
        this.element = document.createElement('div');
        this.element.classList.add('boost');
        this.element.innerText = this.message;
        document.body.appendChild(this.element);
    }

    public hide() {
        this.element.remove();
    }


}
