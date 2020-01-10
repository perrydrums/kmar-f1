var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Difficulty } from './difficulty.js';
export class Quiz {
    constructor() {
        this.myQuestions = [];
        this.jsonData = [];
        this.myDifficulties = [];
        this.score = 0;
        this.quizElement = document.createElement("div");
        this.quizElement.classList.add('quiz');
        document.body.appendChild(this.quizElement);
    }
    setDifficulties() {
        return __awaiter(this, void 0, void 0, function* () {
            const file = yield fetch('./questions.json');
            const json = yield file.json();
            this.jsonData = Object.entries(json);
            for (const [difficultyName, questionData] of this.jsonData) {
                this.myDifficulties[difficultyName] = new Difficulty(difficultyName, questionData);
            }
        });
    }
    getQuestion(id) {
        return this.myQuestions[id].getQuestion();
    }
}
