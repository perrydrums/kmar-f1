export class Score {
    public totalScore:number = 5;
    public _element: HTMLElement;
    
    constructor(){
      this._element = document.createElement("score");
      let foreground = document.getElementsByTagName("foreground")[0];
      foreground.appendChild(this._element);
    }

    public update():void {
      this._element.innerText = "Score: " + this.totalScore;
    }
}
