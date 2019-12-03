import { Vehicle } from './vehicle.js';
import { Forward } from './strategy/forward.js';

export class Car extends Vehicle {

    private randomWord:string
    private splitted:string[] = [];
    private currentLetter:number = 0;

    constructor() {
        super()

        this.element = document.createElement("car")
        let foreground = document.getElementsByTagName("foreground")[0]
        foreground.appendChild(this.element)
        window.addEventListener("keydown", (e:KeyboardEvent) => this.onKeyDown(e))
        this.check = this.game.generateRandom()
        this.posy = 580;
        this.behavior = new Forward(this)
        this.makeWord();
    }

    private makeWord() {
        this.randomWord = this.game.randomWord();
        this.game.setWord(this.randomWord);
    }

    private onKeyDown(event:KeyboardEvent):void {

        const keyCode = this.randomWord.charAt(this.currentLetter).toUpperCase().charCodeAt(0);

        switch(event.keyCode){
            case keyCode:
                if (this.currentLetter === this.randomWord.length - 1) {
                    this.currentLetter = 0;
                    this.speed += 0.10;
                    if (this.speed > 0){
                        this.behavior = new Forward(this)
                    }
                    this.makeWord();
                }
                else {
                    const letterSpans = document.getElementById('word').childNodes;
                    letterSpans[this.currentLetter].classList.add('correct');
                    this.currentLetter ++;
                }
                break;

                default: this.speed-=0.10;


            }
    }

    public update():void{
        this.behavior.update()
    }
}
