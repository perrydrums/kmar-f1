import {Question} from './question.js';
import {Difficulty} from './difficulty.js';

export class Quiz {
    public quizElement: HTMLElement;
    public myQuestions: Array<any> = [];
    public jsonData: Array<any> = [];
    public myDifficulties: Array<any> = [];
    public score: number = 0;
    public question: Question;
    public difficulty: Difficulty;

    constructor() {
        this.quizElement = document.createElement("div");
        this.quizElement.classList.add('quiz');
        document.body.appendChild(this.quizElement);
    }

    public async setDifficulties() {
        const file = await fetch('./questions.json');
        const json = await file.json();

        this.jsonData = Object.entries(json);

        for (const [difficultyName, questionData] of this.jsonData) {
            this.myDifficulties[difficultyName] = new Difficulty(
                difficultyName,
                questionData
            );
        }
    }

    public getQuestion(id: string) {
        return this.myQuestions[id].getQuestion();
    }
}

