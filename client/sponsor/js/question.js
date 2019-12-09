export class Question {
    constructor(id, question, choices, correctAnswer) {
        this.id = id;
        this.question = question;
        this.choices = choices;
        this.correctAnswer = correctAnswer;
    }
    getId() {
        return this.id;
    }
    getQuestion() {
        return this.question;
    }
    getChoices() {
        return this.choices;
    }
    getCorrectAnswer() {
        return this.correctAnswer;
    }
    isCorrectAnswer(choice) {
        return this.correctAnswer === choice;
    }
}
