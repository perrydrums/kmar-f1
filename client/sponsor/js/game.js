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
import { Timer } from './timer.js';
export class Game {
    constructor() {
        this._fps = 30;
        this.running = false;
        this.currentSetQuestions = [];
        this.streak = 0;
        this._fpsInterval = 1000 / this._fps;
        this._then = Date.now();
        this.quiz = new Quiz();
        this.timer = new Timer();
        this.currentDifficulty = "easy";
        this.questionId = "1:1";
        this.timer.start();
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
        let questions = this.quiz.myDifficulties[this.currentDifficulty].getQuestions();
        this.setQuestions(questions);
        let currentQuestion = this.currentSetQuestions[this.questionId];
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
            this.nextQuestionId = choiceData.nextQuestionId;
            let element = document.getElementById("choice" + i);
            element.innerHTML = choiceData.answer;
            this.submit("btn" + i, answer, this.nextQuestionId);
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
                this.isUndifinedQuestionId();
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
        this.timer.reset();
        console.log("Next question!");
    }
    isTimeIsUp() {
        if (this.timer.timeIsUp == true) {
            this.timer.isRunning = false;
            console.log("tijd op");
            this.givePenalty();
            this.timer.timeIsUp = false;
        }
    }
    givePenalty() {
        console.log("penalty");
        this.quiz.score = Game.getInstance().quiz.score - 2;
        this.streak = 0;
        this.getNextQuestion(this.nextQuestionId);
    }
    showCorrectOrIncorrect(correctAnswer, answer, button) {
        this.timer.reset();
        if (correctAnswer === answer) {
            button.classList.toggle("correct");
            setTimeout(() => {
                Game.getInstance().getNextQuestion(this.nextQuestionId);
                button.classList.toggle("correct");
            }, 1000);
        }
        else {
            button.classList.toggle("incorrect");
            setTimeout(() => {
                button.classList.toggle("incorrect");
                Game.getInstance().givePenalty();
            }, 1000);
        }
    }
    submit(id, answer) {
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
                    Game.getInstance().showCorrectOrIncorrect(correctAnswer, answer, button);
                }
                else if (Game.getInstance().currentDifficulty == "medium" || Game.getInstance().currentDifficulty == "hard") {
                    Game.getInstance().quiz.score = Game.getInstance().quiz.score + 2;
                    Game.getInstance().showCorrectOrIncorrect(correctAnswer, answer, button);
                }
                else if (Game.getInstance().currentDifficulty == "very hard") {
                    Game.getInstance().quiz.score = Game.getInstance().quiz.score + 3;
                    Game.getInstance().showCorrectOrIncorrect(correctAnswer, answer, button);
                }
                else if (Game.getInstance().currentDifficulty == "extreme") {
                    Game.getInstance().quiz.score = Game.getInstance().quiz.score + 5;
                    Game.getInstance().showCorrectOrIncorrect(correctAnswer, answer, button);
                }
            }
            else {
                Game.getInstance().showCorrectOrIncorrect(correctAnswer, answer, button);
            }
        };
    }
    isUndifinedQuestionId() {
        if (Game.getInstance().questionId == undefined) {
            Game.getInstance().questionId = "1:1";
        }
    }
    changeDifficulty() {
        if (this.quiz.score < 0) {
            Game.getInstance().currentDifficulty = "very easy";
            this.isUndifinedQuestionId();
        }
        if (this.quiz.score >= 10) {
            Game.getInstance().currentDifficulty = "easy";
            this.isUndifinedQuestionId();
        }
        if (this.quiz.score >= 20) {
            Game.getInstance().currentDifficulty = "medium";
            this.isUndifinedQuestionId();
        }
        if (this.quiz.score >= 40) {
            Game.getInstance().currentDifficulty = "hard";
            this.isUndifinedQuestionId();
        }
        if (this.quiz.score >= 65) {
            Game.getInstance().currentDifficulty = "very hard";
            this.isUndifinedQuestionId();
        }
        if (this.quiz.score >= 85) {
            Game.getInstance().currentDifficulty = "extreme";
            this.isUndifinedQuestionId();
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
        console.log("run");
        this.isTimeIsUp();
        const now = Date.now();
        this.timer.update();
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
