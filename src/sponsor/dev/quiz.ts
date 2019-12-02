import {Question} from './question.js';
import {Game} from './game.js';
// import { isNullOrUndefined } from 'util';

export class Quiz {
    public quizElement : HTMLElement
    public myQuestions:Array<any> = [];
    public score : number = 0;
    public loaded : boolean = false;

    constructor(){
        this.quizElement = document.createElement("div")
        this.quizElement.classList.add('quiz');
        document.body.appendChild(this.quizElement);

        console.log('QUIZ');
    }

    public async setQuestions() {
        const file = await fetch('./questions.json');
        console.log(file);
        
        const json = await file.json();

        for (let id in json) {
            this.myQuestions[id] = new Question(
                id, 
                json[id].question, 
                json[id].choices, 
                json[id].correctAnswer);
        }
    }   

    public showProgress() {
    }

    public async showScores(){
        console.log("Score.")
    }

    public getQuestion(id:string) {
        return this.myQuestions[id].getQuestion();
    }
}

