var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Quiz } from './quiz.js';
export class Game {
    constructor() {
        this._fps = 30;
        this.running = false;
        this._fpsInterval = 1000 / this._fps;
        this._then = Date.now();
        console.log('GAME');
        this.quiz = new Quiz();
        this.generateQuiz();
        this.gameLoop();
    }
    static getInstance() {
        if (!this._instance) {
            this._instance = new Game();
        }
        return this._instance;
    }
    startGame() {
        this.running = true;
        console.log('Starting game...');
    }
    showQuestion() {
        console.log('Get question');
        let currentQuestion = this.quiz.myQuestions["1:1"];
        let element = document.getElementById("question");
        element.innerHTML = currentQuestion.getQuestion();
    }
    showChoices() {
        console.log("show choices");
        let choices = this.quiz.myQuestions["1:1"].getChoices();
        for (let i = 0; i < choices.length; i++) {
            choices.push();
        }
        choices = Object.entries(choices);
        for (const [i, choice] of choices) {
            let element = document.getElementById("choice" + i);
            element.innerHTML = choice;
            this.submit("btn" + i, choice);
        }
        console.log("choices: ", choices);
    }
    isEnded() {
        return false;
    }
    generateQuiz() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.isEnded()) {
            }
            else {
                yield this.quiz.setQuestions();
                this.showQuestion();
                this.showChoices();
                console.log("Generating quiz...");
            }
        });
    }
    submit(id, submit) {
        let button = document.getElementById(id);
        button.onclick = function () {
            submit(submit);
            console.log(submit);
            console.log("submit");
        };
        if (this.quiz.myQuestions["1:1"].isCorrectAnswer(submit)) {
            this.quiz.score++;
        }
        console.log("score");
        console.log(this.quiz.score);
    }
    gameLoop() {
        requestAnimationFrame(() => this.gameLoop());
        const now = Date.now();
        const elapsed = now - this._then;
        console.log("Game is looping...");
        if (this.running) {
            console.log("Running...");
            if (elapsed > this._fpsInterval) {
                this._then = now - (elapsed % this._fpsInterval);
            }
        }
    }
}
window.addEventListener("load", () => {
    Game.getInstance();
});
