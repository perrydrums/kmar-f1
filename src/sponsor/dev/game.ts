import {Quiz} from './quiz.js';
import {Question} from './question.js';

export class Game {

  private static _instance:Game;

  /**
   * The speed, in frames per second, the game runs at.
   */
  private _fps:number = 30;

  private _fpsInterval:number;

  private _then:number;

  private running:boolean = false;

  public quiz:Quiz;

  public question:Question;

  public questionId:string;

  /**
   * Make the constructor private.
   */ 
  private constructor() {
    this._fpsInterval = 1000 / this._fps;
    this._then = Date.now();
  
    this.quiz = new Quiz();
    this.questionId = "1:0"; //this.question.getId();

    this.generateQuiz();
    this.gameLoop();
  }

  /**
   * There can always only be one Game instance.
   * 
   * @returns {Game}
   */
  public static getInstance():Game {
    if (!this._instance) {
      this._instance = new Game();
    }
    return this._instance;
  }

  public startGame():void {
    this.running = true;
  }

  public showQuestion() {
    let currentQuestion = this.quiz.myQuestions[this.questionId];
    let element = document.getElementById("question");
    element.innerHTML = currentQuestion.getQuestion();
  }

  public showChoices() {
    let choices = this.quiz.myQuestions[this.questionId].getChoices();

    for (let i = 0; i < choices.length; i++) {
      choices.push();
    }

    choices = Object.entries(choices)

    for (const [i, choice] of choices) {
      let element = document.getElementById("choice" + i);
      element.innerHTML = choice;

      this.submit("btn" + i, choice);
    }
  }

  public isEnded():boolean {
    return false;
    // return this.question.id === this.quiz.myQuestions.finalQuestionId;
  }

  public async generateQuiz() {
    if (this.isEnded()) {
      // TODO
    }
    else {
      await this.quiz.setQuestions();
      this.showQuestion();
      this.showChoices();
    }

    this.showScore();
  }

  public nextQuestion() {
    this.showQuestion();
    this.showChoices();
    this.showScore();

    console.log("Next question!")
  }
  
  public submit(id, submit) {
    let button = document.getElementById(id);
    let correctAnswer = this.quiz.myQuestions[this.questionId].getCorrectAnswer();

    button.onclick = function() {
      console.log("Submitted answer: ", submit);
      console.log("Correct answer: ", correctAnswer);

      if (correctAnswer === submit) {
        console.log("Correct!")
        Game.getInstance().quiz.score ++;
      }
      else {
        console.log("Wrong...")
        Game.getInstance().quiz.score --;
      }

      Game.getInstance().nextQuestion();
    }
  }

  public showScore() {
    var element = document.getElementById("score");
    element.innerHTML = "Score: " + this.quiz.score;
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
}

window.addEventListener("load", () => {
  Game.getInstance()
});