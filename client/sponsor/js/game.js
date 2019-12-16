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
        this.quiz = new Quiz();
        this.questionId = "1:0";
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
    }
    showQuestion() {
        let currentQuestion = this.quiz.myQuestions[this.questionId];
        let element = document.getElementById("question");
        element.innerHTML = currentQuestion.getQuestion();
    }
    showChoices() {
        let choices = this.quiz.myQuestions[this.questionId].getChoices();
        for (let i = 0; i < choices.length; i++) {
            choices.push();
        }
        choices = Object.entries(choices);
        for (const [i, choiceData] of choices) {
            for (let i = 0; i < choiceData.length; i++) {
                choiceData.push();
            }
            let answer = choiceData.answer;
            let nextQuestionId = choiceData.nextQuestionId;
            let element = document.getElementById("choice" + i);
            element.innerHTML = choiceData.answer;
            this.submit("btn" + i, answer, nextQuestionId);
        }
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
            }
            this.showScore();
        });
    }
    getNextQuestion(nextQuestionId) {
        this.questionId = nextQuestionId;
        this.showQuestion();
        this.showChoices();
        this.showScore();
        console.log("Next question!");
    }
    submit(id, answer, nextQuestionId) {
        let button = document.getElementById(id);
        let correctAnswer = this.quiz.myQuestions[this.questionId].getCorrectAnswer();
        button.onclick = function () {
            console.log("Submitted answer: ", answer);
            console.log("Correct answer: ", correctAnswer);
            console.log("Next question: ", nextQuestionId);
            if (correctAnswer === answer) {
                console.log("Correct!");
                Game.getInstance().quiz.score++;
            }
            else {
                console.log("Wrong...");
                Game.getInstance().quiz.score--;
            }
            Game.getInstance().getNextQuestion(nextQuestionId);
        };
    }
    showScore() {
        var element = document.getElementById("score");
        element.innerHTML = "Score: " + this.quiz.score;
    }
    gameLoop() {
        requestAnimationFrame(() => this.gameLoop());
        const now = Date.now();
        const elapsed = now - this._then;
        if (this.running) {
            if (elapsed > this._fpsInterval) {
                this._then = now - (elapsed % this._fpsInterval);
            }
        }
    }
}
window.addEventListener("load", () => {
    Game.getInstance();
});
