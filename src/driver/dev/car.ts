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

  private speedX:number = 0;
  private speedY:number = 0;

  private canGoLeft:boolean = true;
  private canGoRight:boolean = true;

  public posX:number = 0;
  public posY:number = 0;

  public hit:boolean = false;

  public constructor() {
    // Create car element.
    this._element = document.createElement('div');
    this._element.classList.add('car');
    document.body.appendChild(this._element);

    this.posX = 0;
    this.posY = 0;

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
        if (this.canGoRight) {
          this.speedX = 15;
          this._element.classList.add('carright');
        }
        else {
          this.speedX = 0;
        }
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
      this.canGoRight = false;
    } else {
      this.canGoRight = true;
    }

    let blockLeft = document.querySelector('.block-left');

    if (this._element.getBoundingClientRect().left < blockLeft.getBoundingClientRect().right) {
      this.canGoLeft = false;
    } else {
      this.canGoLeft = true;
    }

    this.posX += this.speedX;
    this.posY += this.speedY;
      
    this._element.style.transform = `translate(${this.posX}px, ${this.posY}px)`;
    this.drive();
  }
}