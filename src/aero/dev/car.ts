export class Car {

  public _element: HTMLElement;
  private x: number = -300;
  public done: boolean = false;
  public drawn: boolean = false;
  public carOverlay: HTMLElement;
  public number: HTMLElement;
  public questionMark: HTMLElement;
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
    if (this.x < 400) {
      this.x += 25;
      this._element.style.left = this.x + 'px';
      this._element.style.transform = 'rotate(' + (this.x * 0.675) + 'deg)';
    } else {
      this.checkDrawn()
    }
  }

  private checkDrawn() {
    if (!this.drawn) {
      this.createOverlay();
    }
    this.drawn = true;
  }

  private async createOverlay() {

    this.carOverlay = document.createElement('div');
    this.carOverlay.classList.add('car-overlay');
    this._element.appendChild(this.carOverlay);

    this.questionMark = document.createElement('div');
    this.questionMark.classList.add('number', 'question-mark');
    this.questionMark.innerHTML = '?';
    this._element.appendChild(this.questionMark);

    this.currentSequence = await this.getSequence(1);
    console.log(this.currentSequence);

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

  /**
   * Remove the car from the view and set car as DONE.
   */
  private leave() {
    if (this.x < 1200) {
      this.x += 50;
      this._element.style.top = this.x + 'px';
    }
    else {
      this._element.remove();
      this.done = true;
    }
  }

  /**
   * Runs every game tick.
   */
  public update() {
    this.enter();
    //   if (this.tires.length !== 4 || this.gas <= 50) {
    //     this.enter();
    //   }
    //   else {
    //     this.leave();
    //   }

  }

}