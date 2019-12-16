import {Question} from './question.js';

export class Difficulty {
    public question:Question;
    public difficultyName:string;
    public questions:Array<any> = [];

    constructor(difficultyName:string, questions:Array<any>) {
        this.difficultyName = difficultyName;
        this.questions = questions;
    }

    getDifficulty(): string {
        return this.difficultyName;
    }

    getQuestions(): Array<any> {
        return this.questions;
    }
}