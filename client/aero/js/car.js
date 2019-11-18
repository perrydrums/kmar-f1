var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export class Car {
    constructor() {
        this.x = -300;
        this.done = false;
        this.drawn = false;
        this.sequences = [];
        this.currentSequence = [];
        this._element = document.createElement('div');
        this._element.classList.add('car');
        document.body.appendChild(this._element);
    }
    enter() {
        if (this.x < 400) {
            this.x += 25;
            this._element.style.left = this.x + 'px';
            this._element.style.transform = 'rotate(' + (this.x * 0.675) + 'deg)';
        }
        else {
            this.checkDrawn();
        }
    }
    checkDrawn() {
        if (!this.drawn) {
            this.createOverlay();
        }
        this.drawn = true;
    }
    createOverlay() {
        return __awaiter(this, void 0, void 0, function* () {
            this.carOverlay = document.createElement('div');
            this.carOverlay.classList.add('car-overlay');
            this._element.appendChild(this.carOverlay);
            this.questionMark = document.createElement('div');
            this.questionMark.classList.add('number', 'question-mark');
            this.questionMark.innerHTML = '?';
            this._element.appendChild(this.questionMark);
            this.currentSequence = yield this.getSequence(1);
            console.log(this.currentSequence);
            for (let index = 0; index < 5; index++) {
                let classIndex = index + 1;
                this.number = document.createElement('div');
                this.number.classList.add('number', 'number-' + classIndex);
                this.number.innerHTML = this.currentSequence['sequence'][index];
                console.log(this.number);
                this._element.appendChild(this.number);
            }
        });
    }
    getSequence(number) {
        return __awaiter(this, void 0, void 0, function* () {
            const file = yield fetch('sequences.json');
            this.sequences = yield file.json();
            const sendSequence = this.sequences['sequences'][number];
            return sendSequence;
        });
    }
    leave() {
        if (this.x < 1200) {
            this.x += 50;
            this._element.style.top = this.x + 'px';
        }
        else {
            this._element.remove();
            this.done = true;
        }
    }
    update() {
        this.enter();
    }
}
