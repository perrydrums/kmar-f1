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


  /**
   * Make the constructor private.
   */ 
  private constructor() {
    this._fpsInterval = 1000 / this._fps;
    this._then = Date.now();
  
    console.log('GAME');

    this.quiz = new Quiz();

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

    console.log('Starting game...');
  }

  public showQuestion() {
    // TODO: fix current id
    console.log('Get question');

    let currentQuestion = this.quiz.myQuestions["1:1"];
    let element = document.getElementById("question");
    element.innerHTML = currentQuestion.getQuestion();
  }

  public showChoices() {
    // TODO: fix current id
    console.log("show choices")
    let choices = this.quiz.myQuestions["1:1"].getChoices();

    for (let i = 0; i < choices.length; i++) {
      choices.push()
    }

    choices = Object.entries(choices)

    for (const [i, choice] of choices) {
      let element = document.getElementById("choice" + i);
      element.innerHTML = choice;

      this.submit("btn" + i, choice);
    }
    
    // console.log("l2", choices.length);
    console.log("choices: ", choices)

  }

  public isEnded():boolean {
    return false;
    // return this.question.id == this.quiz.myQuestions.length;
  }

  public async generateQuiz() {
    if (this.isEnded()) {
      // TODO
    }
    else {
      await this.quiz.setQuestions();
      this.showQuestion();
      this.showChoices();

      console.log("Generating quiz...")
    }
  }
  
  public submit(id, submit) {
    let button = document.getElementById(id);
    button.onclick = function() {
        submit(submit);

        console.log(submit);
        console.log("submit");
    }

    if (this.quiz.myQuestions["1:1"].isCorrectAnswer(submit)) {
        this.quiz.score++;
    }

    console.log("score");
    console.log(this.quiz.score);

    // TODO: nextQuestion()
}
  
  /**
   * Runs approx. {this._fps} times a second.
   */
  gameLoop() {
    requestAnimationFrame(() => this.gameLoop());

    // Calculate elapsed time.
    const now = Date.now();
    const elapsed = now - this._then;
    console.log("Game is looping...");

    if (this.running) {
      // If enough time has elapsed, draw the next frame.

      console.log("Running...");
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