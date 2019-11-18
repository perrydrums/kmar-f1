export class Gas {

  public element:HTMLElement;
  public amount:number;

  public constructor() {
    this.element = document.getElementById('game-gasmeter');
    this.amount = 0;
  }

  /**
   * Run every game tick.
   */
  public update() {
    // Update the game gasmeter element.
    // Do the amount of gas * 4.8 to match the element height.
    const height = (this.amount * 4.8) + 'px';
    const innerElement = document.getElementById('game-gasmeter-inner');
    innerElement.style.height = height;
  }

  /**
   * Reduce the amount of gas.
   */
  public drain() {
    this.amount --;
  }

  /**
   * Reset the amount of gas.
   */
  public reset() {
    // remove function.
  }

  public addGasoline(amount:number) {
    console.log('PITSTOP: ADD GAS', amount);
    if (this.amount < 100) {
      this.amount += amount;
      if (this.amount >= 100) {
        this.amount = 100;
      }
    }

    console.log('AMOUNT', this.amount);
  }

}