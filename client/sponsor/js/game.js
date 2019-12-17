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
import { Question } from './question.js';
export class Game {
    constructor() {
        this._fps = 30;
        this.running = false;
        this.currentSetQuestions = [];
        this.streak = 0;
        this._fpsInterval = 1000 / this._fps;
        this._then = Date.now();
        this.quiz = new Quiz();
        this.currentDifficulty = "easy";
        this.questionId = "1:1";
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
        let currentDifficulty = this.quiz.myDifficulties[this.currentDifficulty].getDifficulty();
        console.log("Current diff: ", currentDifficulty);
        let questions = this.quiz.myDifficulties[this.currentDifficulty].getQuestions();
        console.log("questions van easy: ", questions);
        this.setQuestions(questions);
        console.log("set questions", this.currentSetQuestions["1:1"]);
        let currentQuestion = this.currentSetQuestions[this.questionId];
        console.log("currentQuestion:", currentQuestion);
        let element = document.getElementById("question");
        element.innerHTML = currentQuestion.getQuestion();
    }
    setQuestions(questions) {
        for (let id in questions) {
            this.currentSetQuestions[id] = new Question(id, questions[id].question, questions[id].choices, questions[id].correctAnswer);
        }
    }
    showChoices() {
        let choices = this.currentSetQuestions[this.questionId].getChoices();
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
                yield this.quiz.setDifficulties();
                this.showQuestion();
                this.showChoices();
                this.showDifficulty();
                this.showStreak();
                this.showScore();
            }
        });
    }
    getNextQuestion(nextQuestionId) {
        this.questionId = nextQuestionId;
        this.changeDifficulty();
        this.showQuestion();
        this.showChoices();
        this.showScore();
        this.showStreak();
        this.showDifficulty();
        console.log("Next question!");
    }
    submit(id, answer, nextQuestionId) {
        let button = document.getElementById(id);
        let correctAnswer = this.currentSetQuestions[this.questionId].getCorrectAnswer();
        button.onclick = function () {
            if (correctAnswer === answer) {
                console.log("Correct!");
                Game.getInstance().streak++;
                if (Game.getInstance().streak >= 3) {
                    Game.getInstance().quiz.score++;
                }
                if (Game.getInstance().currentDifficulty == "very easy" || Game.getInstance().currentDifficulty == "easy") {
                    Game.getInstance().quiz.score++;
                }
                else if (Game.getInstance().currentDifficulty == "medium" || Game.getInstance().currentDifficulty == "hard") {
                    Game.getInstance().quiz.score = Game.getInstance().quiz.score + 2;
                }
                else if (Game.getInstance().currentDifficulty == "very hard") {
                    Game.getInstance().quiz.score = Game.getInstance().quiz.score + 3;
                }
                else if (Game.getInstance().currentDifficulty == "extreme") {
                    Game.getInstance().quiz.score = Game.getInstance().quiz.score + 5;
                }
            }
            else {
                console.log("Wrong...");
                Game.getInstance().quiz.score = Game.getInstance().quiz.score - 2;
                Game.getInstance().streak = 0;
            }
            Game.getInstance().getNextQuestion(nextQuestionId);
        };
    }
    changeDifficulty() {
        if (this.quiz.score < 0) {
            Game.getInstance().currentDifficulty = "very easy";
            Game.getInstance().questionId = "1:1";
        }
        if (this.quiz.score >= 10) {
            Game.getInstance().currentDifficulty = "easy";
            Game.getInstance().questionId = "1:1";
        }
        if (this.quiz.score >= 20) {
            Game.getInstance().currentDifficulty = "medium";
            Game.getInstance().questionId = "1:1";
        }
        if (this.quiz.score >= 40) {
            Game.getInstance().currentDifficulty = "hard";
            Game.getInstance().questionId = "1:1";
        }
        if (this.quiz.score >= 65) {
            Game.getInstance().currentDifficulty = "very hard";
            Game.getInstance().questionId = "1:1";
        }
        if (this.quiz.score >= 85) {
            Game.getInstance().currentDifficulty = "extreme";
            Game.getInstance().questionId = "1:1";
        }
    }
    showScore() {
        var element = document.getElementById("score");
        element.innerHTML = "Score: " + this.quiz.score;
    }
    showDifficulty() {
        var element = document.getElementById("difficulty");
        element.innerHTML = "Moeilijkheid: " + this.currentDifficulty;
    }
    showStreak() {
        var element = document.getElementById("streak");
        element.innerHTML = "Reeks: " + this.streak.toString();
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
