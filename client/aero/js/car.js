var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Game } from "./game.js";
export class Car {
    constructor() {
        this.x = -300;
        this.done = false;
        this.drawn = false;
        this.correct = false;
        this.sequences = {};
        this.currentSequence = {};
        this._element = document.createElement('div');
        this._element.classList.add('car');
        document.body.appendChild(this._element);
    }
    enter() {
        if (this.x < 650) {
            this.x += 25;
            this._element.style.left = this.x + 'px';
            this._element.style.transform = 'rotate(' + (this.x * -0.1384615385) + 'deg)';
        }
        else {
            this.checkDrawn();
        }
    }
    checkDrawn() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.drawn) {
                this.createOverlay();
            }
            this.drawn = true;
        });
    }
    createOverlay() {
        return __awaiter(this, void 0, void 0, function* () {
            this.currentSequence = yield this.getSequence(Game.getInstance().sequenceCount);
            Game.getInstance().sequenceCount += 1;
            this.carOverlay = document.createElement('div');
            this.carOverlay.classList.add('car-overlay');
            this._element.appendChild(this.carOverlay);
            this.questionMark = document.createElement('div');
            this.questionMark.classList.add('number', 'question-mark');
            this.questionMark.innerHTML = '?';
            this._element.appendChild(this.questionMark);
            this.answers = document.createElement('div');
            this.answers.classList.add('answers');
            document.body.appendChild(this.answers);
            for (let index = 0; index < 4; index++) {
                this.answer = document.createElement('div');
                this.answer.classList.add('answer');
                this.answer.innerHTML = this.currentSequence['options'][index];
                this.answer.addEventListener('click', (event) => {
                    const boolean = this.checkAnswer(this.currentSequence['options'][index]);
                    if (boolean) {
                        event.target.classList.add('correct');
                    }
                    else {
                        event.target.classList.add('incorrect');
                    }
                });
                this.answers.appendChild(this.answer);
            }
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
            return this.sequences['sequences'][number];
        });
    }
    checkAnswer(number) {
        if (this.currentSequence['answer'] === number) {
            this.correct = true;
            Game.getInstance().boost();
            return true;
        }
        else {
            Game.getInstance().slowdown();
            return false;
        }
    }
    leave() {
        if (this.x < 1400) {
            this.x += 35;
            this._element.style.left = this.x + 'px';
            this.carOverlay.remove();
            const numberDivs = document.querySelectorAll(".number");
            for (const number of numberDivs) {
                number.remove();
            }
        }
        else {
            this._element.remove();
            this.answers.remove();
            this.done = true;
        }
    }
    update() {
        this.enter();
        if (!this.correct) {
            this.enter();
        }
        else {
            this.leave();
        }
    }
}
