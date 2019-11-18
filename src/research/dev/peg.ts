export class Peg {

    public answer:number;
    public htmlElement :HTMLElement;
    public amount: number = 0;
    public oldAmount: number;

    constructor(answer:number){
        this.answer = answer;

        this.htmlElement = document.createElement('button');
        this.htmlElement.classList.add('peg');
        let pegDiv = document.querySelector(".pegContainer");
        pegDiv.appendChild(this.htmlElement);

        this.htmlElement.addEventListener("click", () => {
            this.clickHandler();
        });
    }

    public clickHandler() {
        if(this.amount === 4){
            this.amount = 1;
            this.htmlElement.classList.remove('color-4');
            this.htmlElement.classList.add('color-' + this.amount);
        } else {
            this.amount += 1;
            this.oldAmount = this.amount - 1;
            this.htmlElement.classList.remove('color-' + this.oldAmount);
            this.htmlElement.classList.add('color-' + this.amount);
        }
    }
}