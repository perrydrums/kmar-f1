export class Difficulty {
    constructor(difficultyName, questions) {
        this.questions = [];
        this.difficultyName = difficultyName;
        this.questions = questions;
    }
    getDifficulty() {
        return this.difficultyName;
    }
    getQuestions() {
        return this.questions;
    }
}
