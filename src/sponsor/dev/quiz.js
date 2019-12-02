var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Question } from './question.js';
export class Quiz {
    constructor() {
        this.myQuestions = [];
        this.score = 0;
        this.loaded = false;
        this.quizElement = document.createElement("div");
        this.quizElement.classList.add('quiz');
        document.body.appendChild(this.quizElement);
        console.log('QUIZ');
    }
    setQuestions() {
        return __awaiter(this, void 0, void 0, function* () {
            const file = yield fetch('./questions.json');
            console.log(file);
            const json = yield file.json();
            for (let id in json) {
                this.myQuestions[id] = new Question(id, json[id].question, json[id].choices, json[id].answer, json[id].nextQuestion, json[id].correctAnswer);
            }
        });
    }
    showProgress() {
    }
    showScores() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Score.");
        });
    }
    getQuestion(id) {
        return this.myQuestions[id].getQuestion();
    }
}
