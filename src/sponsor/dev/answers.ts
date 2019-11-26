export class Answers {
    public _element:HTMLElement;
    
    public constructor() {
        this._element = document.createElement('div');
        this._element.classList.add('answer');
    }
}