export class RainTire {
    constructor() {
        this._element = document.createElement('div');
        this._element.classList.add('tire');
        this._element.classList.add('tire--rain');
        document.getElementById('tirerack--rain').appendChild(this._element);
    }
    grabbed() {
        this._element.remove();
    }
}
