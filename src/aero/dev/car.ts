import { Game } from "./game.js"

export class Car {

  public _element: HTMLElement;
  private x: number = -300;
  public done: boolean = false;
  public drawn: boolean = false;
  public carOverlay: HTMLElement;
  public number: HTMLElement;
  public questionMark: HTMLElement;
  public answers: HTMLElement;
  public answer: HTMLElement;
  public correct: boolean = false;
  public sequences: [] = [];
  public currentSequence: [] = [];

    public constructor() {
      // Create car element.
      this._element = document.createElement('div');
      this._element.classList.add('car');
      document.body.appendChild(this._element);
    }

  /**
   * Move the car into place.
   */
  public enter() {
    if (this.x < 650) {
      this.x += 25;
      this._element.style.left = this.x + 'px';
      this._element.style.transform = 'rotate(' + (this.x * -0.1384615385) + 'deg)';
    } else {
      this.checkDrawn()
    }
  }

  private async checkDrawn() {
    if (!this.drawn) {
      this.createOverlay();
    }
    this.drawn = true;
  }

  private async createOverlay() {

    this.currentSequence = await this.getSequence(Game.getInstance().sequenceCount);
    Game.getInstance().sequenceCount += 1;

    this.carOverlay = document.createElement('div');
    this.carOverlay.classList.add('car-overlay');
    this._element.appendChild(this.carOverlay);

    this.questionMark = document.createElement('div');
    this.questionMark.classList.add('number', 'question-mark');
    this.questionMark.innerHTML = '?';
    this._element.appendChild(this.questionMark);

    this.answers = document.createElement('div');
    this.answers.classList.add('answers');
    document.body.appendChild(this.answers);

    for (let index = 0; index < 4; index++) {
      this.answer = document.createElement('div');
      this.answer.classList.add('answer')
      this.answer.innerHTML = this.currentSequence['options'][index];
      this.answer.addEventListener('click', (event) => {
        const boolean = this.checkAnswer(this.currentSequence['options'][index]);
        if (boolean) {
          event.target.classList.add('correct')
        } else {
          event.target.classList.add('incorrect')
        }
      });
      this.answers.appendChild(this.answer);
    }

    for (let index = 0; index < 5; index++) {
      let classIndex = index + 1;
      this.number = document.createElement('div');
      this.number.classList.add('number', 'number-' + classIndex);
      this.number.innerHTML = this.currentSequence['sequence'][index];
      console.log(this.number);
      this._element.appendChild(this.number);
    }

  }

  private async getSequence(number:number) {
    const file = await fetch('sequences.json');
    this.sequences = await file.json();
    const sendSequence = this.sequences['sequences'][number];
    return sendSequence;
  }

  private checkAnswer(number:number) {
    if (this.currentSequence['answer'] === number) {
      this.correct = true;
      Game.getInstance().boost();
      return true;
    } else {
        Game.getInstance().slowdown();

        return false;
    }
  }

  /**
   * Remove the car from the view and set car as DONE.
   */
  private leave() {
    if (this.x < 1400) {
      this.x += 35;
      this._element.style.left = this.x + 'px';
      this.carOverlay.remove();
      const numberdivs = document.querySelectorAll(".number")
      for (const number of numberdivs) {
        number.remove();
      }
    } else {
      this._element.remove();
      this.answers.remove();
      this.done = true;
    }
  }

  /**
   * Runs every game tick.
   */
  public update() {
    this.enter();
      if (!this.correct) {
        this.enter();
      }
      else {
        this.leave();
      }

  }

}
