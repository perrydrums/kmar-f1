export class Question {

    public id:string;
     question:string;
     choices:Array<string>;
     correctAnswer:string;

    constructor(id:string, question:string, choices:Array<string>, correctAnswer:string) {
        this.id = id;
        this.question = question;
        this.choices = choices;
        this.correctAnswer = correctAnswer;
    }

    getId(): string {
        return this.id;
    }
    getQuestion(): string {
        return this.question;
    }
    getChoices(): Array<string> {
        return this.choices;
    }
    getCorrectAnswer(): string {
        return this.correctAnswer;
    }

    isCorrectAnswer(choice:string): boolean {
        return this.correctAnswer === choice;
    }
}