import { Game } from "./game.js"

export class Car {

  public _element: HTMLElement;
  private x: number = -300;
  public done: boolean = false;
  public carOverlay: HTMLElement;
  public number: HTMLElement;
  public questionMark: HTMLElement;
  public answers: HTMLElement;
  public answer: HTMLElement;
  public correct: boolean = false;
  public sequences: [] = [];
  public currentSequence: [] = [];

  private speedX:number = 0;
  private speedY:number = 0;

  private speedLeft:number = -15;
  private speedRight:number = 15;

  private canGoLeft:boolean = true;

  private posX:number = 0;
  private posY:number = 0;

  public constructor() {
    // Create car element.
    this._element = document.createElement('div');
    this._element.classList.add('car');
    document.body.appendChild(this._element);

    window.addEventListener('keydown', (e:KeyboardEvent) => this.onKeyDown(e));
    window.addEventListener('keyup', (e:KeyboardEvent) => this.onKeyUp(e));
  }

    /**
   * Set speed when holding down arrow keys.
   * 
   * @param {KeyboardEvent} e 
   */
  private onKeyDown(e:KeyboardEvent):void {
    switch(e.keyCode){
      case 37:
        console.log('cgl', this.canGoLeft);
        
        if (this.canGoLeft) {
          this.speedX = -15;
          this._element.classList.add('carleft');
        }
        else {
          this.speedX = 0;
        }
        break;
      case 38:
        this.speedY = -15;
        break;
      case 40:
        this.speedY = 15;
        break;
      case 39:
        this.speedX = 15;
        this._element.classList.add('carright');
        break;
    }
  }

  /**
   * Set speed to 0 when letting go of the arrow keys.
   * 
   * @param {KeyboardEvent} e
   */
  private onKeyUp(e:KeyboardEvent):void {
    switch(e.keyCode){
      case 37:
      case 39:
        this.speedX = 0;
        this._element.classList.remove('carleft');
        this._element.classList.remove('carright');
        break;
      case 38:
      case 40:
        this.speedY = 0;
        break;
    }
  }

  public drive() {

  }

  /**
   * Runs every game tick.
   */
  public update() {

    let blockRight = document.querySelector('.block-right');
    
    if (this._element.getBoundingClientRect().right > blockRight.getBoundingClientRect().left) {
      this.speedRight = 0;
    } else {
      this.speedRight = 15;
    }

    let blockLeft = document.querySelector('.block-left');

      if (this._element.getBoundingClientRect().left < blockLeft.getBoundingClientRect().right) {
        this.canGoLeft = false;
        // this.speedLeft = 0;
      } else {
        this.canGoLeft = true;
        // this.speedLeft = -15;
      }
      

    this._element.style.transform = `translate(${this.posX += this.speedX}px, ${this.posY += this.speedY}px)`;
    this.drive();
  }
}