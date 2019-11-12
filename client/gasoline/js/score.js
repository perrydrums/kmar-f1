export class Score {
    constructor() {
        this.totalScore = 5;
        this._element = document.createElement("score");
        let foreground = document.getElementsByTagName("foreground")[0];
        foreground.appendChild(this._element);
    }
    update() {
        this._element.innerText = "Score: " + this.totalScore;
    }
}
