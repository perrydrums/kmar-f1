import { Food } from './food.js';
import { Observer } from './observer.js';
import { Subject } from './subject.js';

export class Anvil extends Food implements Observer {

    subject:Subject;

    constructor(s:Subject){
        super();

        this.subject = s;
        s.subscribe(this);

        this._element = document.createElement("anvil");
        let foreground = document.getElementsByTagName("foreground")[0];
        foreground.appendChild(this._element);

    }

    public action(){
        this.game.addScore(0);

        alert("Je bent de helft van je benzine verloren!");
        // window.location.reload();
    }

    public notify(){
        this.element.remove();
        this.subject.unsubscribe(this);
        this.game.food.slice(this.game.food.indexOf(this), 1);
    }

}