export class Pitstop {

  private static _instance:Pitstop;
  private element:HTMLElement;
  private overlay:HTMLElement;
  private visible:boolean = false;

  private constructor() {}

  /**
   * There can always only be one Dialog instance.
   * 
   * @returns {Pitstop}
   */
  public static getInstance():Pitstop {
    if (!this._instance) {
      this._instance = new Pitstop();
    }
    return this._instance;
  }

  public show() {
    if (!this.visible) {
      this.overlay = document.createElement('div');
      this.overlay.classList.add('overlay');
      document.body.appendChild(this.overlay);
  
      this.element = document.createElement('div');
      this.element.classList.add('pitstop');
      this.overlay.appendChild(this.element);
  
      this.element.innerText = 'IN DE PITSTOP!';

      this.visible = true;
    }
  }

  public hide() {
    this.element.remove();
    this.overlay.remove();
    this.visible = false;
  }

}