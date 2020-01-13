import {Quiz} from './quiz.js';
import {Question} from './question.js';
import {Difficulty} from './difficulty.js';
import {Timer} from './timer.js';
import { threadId } from 'worker_threads';

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

  public difficulty:Difficulty;

  public currentDifficulty:string;

  public currentSetQuestions:Array<any> = [];

  public questionId:string;

  public nextQuestionId:string;

  public streak:number = 0;

  public timer:Timer;

  /**
   * Make the constructor private.
   */ 
  private constructor() {
    this._fpsInterval = 1000 / this._fps;
    this._then = Date.now();
    this.quiz = new Quiz();
    this.timer = new Timer();
    this.currentDifficulty = "easy";
    this.questionId = "1:1";

    this.timer.start();
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
    let questions = this.quiz.myDifficulties[this.currentDifficulty].getQuestions();
    this.setQuestions(questions);

    let currentQuestion = this.currentSetQuestions[this.questionId];

    let element = document.getElementById("question");
    element.innerHTML = currentQuestion.getQuestion();
  }

  public setQuestions(questions) {
    for (let id in questions) {
      this.currentSetQuestions[id] = new Question(
        id, 
        questions[id].question, 
        questions[id].choices, 
        questions[id].correctAnswer
      );
    }
  }

  public showChoices() {
    let choices = this.currentSetQuestions[this.questionId].getChoices();

    for (let i = 0; i < choices.length; i++) {
      choices.push();
    }

    choices = Object.entries(choices);

    for (const [i, choiceData] of choices) {
      for (let i = 0; i < choiceData.length; i++) {
        choiceData.push();
      }

      let answer = choiceData.answer;
      this.nextQuestionId = choiceData.nextQuestionId;

      let element = document.getElementById("choice" + i);
      element.innerHTML = choiceData.answer;

      this.submit("btn" + i, answer, this.nextQuestionId);
    }
  }

  public isEnded():boolean {  
    return false;
  }

  public async generateQuiz() {
    if (this.isEnded()) {
      // TODO
    }
    else {
      await this.quiz.setDifficulties();
      this.isUndifinedQuestionId();
      this.showQuestion();
      this.showChoices();
      this.showDifficulty();
      this.showStreak();
      this.showScore();
    }
  }

  public getNextQuestion(nextQuestionId) {
    this.questionId = nextQuestionId;
    this.changeDifficulty();
    this.showQuestion();
    this.showChoices();
    this.showScore();
    this.showStreak();
    this.showDifficulty();
    this.timer.reset();
    console.log("Next question!")
  }

  public isTimeIsUp() {
    if (this.timer.timeIsUp == true) {
      this.timer.isRunning = false;
      console.log("tijd op");

      this.givePenalty();
      this.timer.timeIsUp = false;
    }
  }

  public givePenalty() {
    console.log("penalty");
    this.quiz.score = Game.getInstance().quiz.score - 2;
    this.streak = 0;
    this.getNextQuestion(this.nextQuestionId);
  }

  public showCorrectOrIncorrect(correctAnswer, answer, button) {
    this.timer.reset();

    if (correctAnswer === answer) {
      button.classList.toggle("correct");
  
      setTimeout(() => {
        Game.getInstance().getNextQuestion(this.nextQuestionId);
        button.classList.toggle("correct");
      }, 1000);
    }
    else {
      button.classList.toggle("incorrect");

      setTimeout(() => {
        button.classList.toggle("incorrect");
        Game.getInstance().givePenalty();
      }, 1000);
    }
  }
  
  public submit(id, answer) {
    let button = document.getElementById(id);
    let correctAnswer = this.currentSetQuestions[this.questionId].getCorrectAnswer();

    button.onclick = function() {
      if (correctAnswer === answer) {
        console.log("Correct!");
        Game.getInstance().streak ++;

        if (Game.getInstance().streak >= 3) {
          Game.getInstance().quiz.score ++;
        }

        if (Game.getInstance().currentDifficulty == "very easy" || Game.getInstance().currentDifficulty == "easy") {
          Game.getInstance().quiz.score ++;
          Game.getInstance().showCorrectOrIncorrect(correctAnswer, answer, button);
        }
        else if (Game.getInstance().currentDifficulty == "medium" || Game.getInstance().currentDifficulty == "hard") {
          Game.getInstance().quiz.score = Game.getInstance().quiz.score + 2;
          Game.getInstance().showCorrectOrIncorrect(correctAnswer, answer, button);

        }
        else if (Game.getInstance().currentDifficulty == "very hard") {
          Game.getInstance().quiz.score = Game.getInstance().quiz.score + 3;
          Game.getInstance().showCorrectOrIncorrect(correctAnswer, answer, button);

        }
        else if (Game.getInstance().currentDifficulty == "extreme") {
          Game.getInstance().quiz.score = Game.getInstance().quiz.score + 5;
          Game.getInstance().showCorrectOrIncorrect(correctAnswer, answer, button);
        }
      }
      else {
        Game.getInstance().showCorrectOrIncorrect(correctAnswer, answer, button);
      }
    }
  }

  public isUndifinedQuestionId(){
    if (Game.getInstance().questionId == undefined){
      Game.getInstance().questionId = "1:1";
    }
  }

  public changeDifficulty() {
    if (this.quiz.score < 0) {
      Game.getInstance().currentDifficulty = "very easy";
      this.isUndifinedQuestionId();
    }
    if (this.quiz.score >= 10) {
      Game.getInstance().currentDifficulty = "easy";
      this.isUndifinedQuestionId();
    }
    if (this.quiz.score >= 20) {
      Game.getInstance().currentDifficulty = "medium";
      this.isUndifinedQuestionId();
    }
    if (this.quiz.score >= 40) {
      Game.getInstance().currentDifficulty = "hard";
      this.isUndifinedQuestionId();
    }
    if (this.quiz.score >= 65) {
      Game.getInstance().currentDifficulty = "very hard";
      this.isUndifinedQuestionId();
    }
    if (this.quiz.score >= 85) {
      Game.getInstance().currentDifficulty = "extreme";
      this.isUndifinedQuestionId();
    }
  }

  public showScore() {
    var element = document.getElementById("score");
    element.innerHTML = "Score: " + this.quiz.score;
  }

  public showDifficulty() {
    var element = document.getElementById("difficulty");
    element.innerHTML = "Moeilijkheid: " + this.currentDifficulty;
  }

  public showStreak() {
    var element = document.getElementById("streak");
    element.innerHTML = "Reeks: " + this.streak.toString();
  }
  
  /**
   * Runs approx. {this._fps} times a second.
   */
  gameLoop() {
    requestAnimationFrame(() => this.gameLoop());
    console.log("run")
    this.isTimeIsUp();

    // Calculate elapsed time.
    const now = Date.now();
    this.timer.update();

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