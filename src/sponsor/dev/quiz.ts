import {Question} from './question.js';
import {Difficulty} from './difficulty.js';
import {Game} from './game.js';
import {isNullOrUndefined} from 'util';

export class Quiz {
    public quizElement: HTMLElement;
    public myQuestions: Array<any> = [];
    public jsonData: Array<any> = [];
    public myDifficulties: Array<any> = []; // :Array<any> = [];
    public score: number = 0;
    public question: Question;
    public difficulty: Difficulty;

    constructor() {
        this.quizElement = document.createElement("div");
        this.quizElement.classList.add('quiz');
        document.body.appendChild(this.quizElement);

        console.log('QUIZ');
    }

    public async setDifficulties() {
        const file = await fetch('./questions.json');
        const json = await file.json();

        this.jsonData = Object.entries(json);

        console.log("jsonD", this.jsonData);

        for (const [difficultyName, questionData] of this.jsonData) {
            this.myDifficulties[difficultyName] = new Difficulty(
                difficultyName,
                questionData
            );

            console.log("QD: ", questionData);
        }

        console.log("diffs: ", this.myDifficulties["medium"]);
        console.log("questions van extreme: ", this.myDifficulties["extreme"].getQuestions());
    }

    // public setQuestions(questionData) {
    //     // for elke diff, get alle questions met antw data
    //     for (let id in questionData) {
    //         this.myQuestions[id] = new Question(
    //             id,
    //             this.myQuestions[id].question,
    //             this.myQuestions[id].choices,
    //             this.myQuestions[id].correctAnswer
    //         );
    //     }
    // }

    public getQuestion(id: string) {
        return this.myQuestions[id].getQuestion();
    }
}

