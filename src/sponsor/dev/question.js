export class Question {
    constructor(id, question, choices, answer, nextQuestion, correctAnswer) {
        this.id = id;
        this.question = question;
        this.choices = choices;
        this.answer = answer;
        this.nextQuestion = nextQuestion;
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
    getAnswers() {
        return this.answer;
    }
    getNextQuestionId() {
        return this.nextQuestion;
    }
    getCorrectAnswer() {
        return this.correctAnswer;
    }
    isCorrectAnswer(choice) {
        return this.correctAnswer === choice;
    }
}
