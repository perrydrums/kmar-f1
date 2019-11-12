export class Tire {
    constructor() {
        this._element = document.createElement('div');
        this._element.classList.add('tire');
        document.getElementById('tirerack').appendChild(this._element);
    }
    grabbed() {
        this._element.remove();
    }
}
