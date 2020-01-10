import {Quiz} from './quiz.js';
import {Question} from './question.js';
import {Difficulty} from './difficulty.js';
import {threadId} from 'worker_threads';

export class Game {

    private static _instance: Game;

    /**
     * The speed, in frames per second, the game runs at.
     */
    private _fps: number = 30;

    private _fpsInterval: number;

    private _then: number;

    private running: boolean = false;

    public quiz: Quiz;

    public question: Question;

    public difficulty: Difficulty;

    public currentDifficulty: string;

    public currentSetQuestions: Array<any> = [];

    public questionId: string;

    public streak: number = 0;

    private socket: SocketIOClient.Socket;

    /**
     * Make the constructor private.
     */
    private constructor() {
        this._fpsInterval = 1000 / this._fps;
        this._then = Date.now();
        this.quiz = new Quiz();
        this.currentDifficulty = "easy";
        this.questionId = "1:1";

        this.socket = io();

        this.socket.emit('sponsor:start', {
            uuid: this.getCookie('uuid'),
        });

        this.socket.on('finish', (data: any) => {
            window.location.href = '/finish';
        });

        this.generateQuiz();
        this.gameLoop();
    }

    /**
     * There can always only be one Game instance.
     *
     * @returns {Game}
     */
    public static getInstance(): Game {
        if (!this._instance) {
            this._instance = new Game();
        }
        return this._instance;
    }

    public startGame(): void {
        this.running = true;
    }

    public showQuestion() {
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

    public setQuestions(questions) {
        for (let id in questions) {
            this.currentSetQuestions[id] = new Question(
                id,
                questions[id].question,
                questions[id].choices,
                questions[id].correctAnswer
            );
        }
    }

    public showChoices() {
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

    public isEnded(): boolean {
        return false;
        // return this.question.id === this.quiz.myQuestions.finalQuestionId;
    }

    public async generateQuiz() {
        if (this.isEnded()) {
            // TODO
        } else {
            await this.quiz.setDifficulties();
            this.showQuestion();
            this.showChoices();
            this.showDifficulty();
            this.showStreak();
            this.showScore();
        }
    }

    public getNextQuestion(nextQuestionId) {
        this.questionId = nextQuestionId;
        this.changeDifficulty();
        this.showQuestion();
        this.showChoices();
        this.showScore();
        this.showStreak();
        this.showDifficulty();

        console.log("Next question!")
    }

    public submit(id, answer, nextQuestionId) {
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
                } else if (Game.getInstance().currentDifficulty == "medium" || Game.getInstance().currentDifficulty == "hard") {
                    Game.getInstance().quiz.score = Game.getInstance().quiz.score + 2;
                } else if (Game.getInstance().currentDifficulty == "very hard") {
                    Game.getInstance().quiz.score = Game.getInstance().quiz.score + 3;
                } else if (Game.getInstance().currentDifficulty == "extreme") {
                    Game.getInstance().quiz.score = Game.getInstance().quiz.score + 5;
                }
            } else {
                console.log("Wrong...");
                Game.getInstance().quiz.score = Game.getInstance().quiz.score - 2;
                Game.getInstance().streak = 0;
            }

            Game.getInstance().getNextQuestion(nextQuestionId);
        }
    }

    public changeDifficulty() {
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

    public showScore() {
        var element = document.getElementById("score");
        element.innerHTML = "Score: " + this.quiz.score;
    }

    public showDifficulty() {
        var element = document.getElementById("difficulty");
        element.innerHTML = "Moeilijkheid: " + this.currentDifficulty;
    }

    public showStreak() {
        var element = document.getElementById("streak");
        element.innerHTML = "Reeks: " + this.streak.toString();
    }

    /**
     * Runs approx. {this._fps} times a second.
     */
    gameLoop() {
        requestAnimationFrame(() => this.gameLoop());

        // Calculate elapsed time.
        const now = Date.now();
        const elapsed = now - this._then;

        if (this.running) {
            // If enough time has elapsed, draw the next frame.

            if (elapsed > this._fpsInterval) {
                // this.player.update();

                // Get ready for next frame by setting then=now, but...
                // Also, adjust for fpsInterval not being multiple of 16.67
                this._then = now - (elapsed % this._fpsInterval);
            }
        }
        // else {
        // if (!this.dialog) {
        // this.dialog = Dialog.getInstance();
        //       this.dialog.setHTML(
        //         '<h1>KMar F1 - Sponsor</h1>' +
        //         '<p>Jij bent verantwoordelijk voor de sponsor.</p>' +
        //         '<p>{uitleg}</p>' +
        //         '<p>{uitleg}</p>'
        //       );
        //       this.dialog.addButton();
        //     }
        //   }
        // }

    }

    /**
     * Get cookie by name.
     *
     * @param name
     */
    private getCookie(name: string) {
        const value = "; " + document.cookie;
        const parts = value.split("; " + name + "=");
        if (parts.length == 2) return parts.pop().split(";").shift();
        return null;
    }
}

window.addEventListener("load", () => {
    Game.getInstance()
});
