import { Food } from './food.js';
export class Anvil extends Food {
    constructor(s, lane) {
        super();
        this.lane = lane;
        this.subject = s;
        s.subscribe(this);
        this._element = document.createElement("anvil");
        let foreground = document.getElementsByTagName("foreground")[0];
        foreground.appendChild(this._element);
        if (this.lane === 1) {
            this._element.classList.add("anvil1");
        }
        else if (this.lane === 2) {
            this._element.classList.add("anvil2");
        }
        else if (this.lane === 3) {
            this._element.classList.add("anvil3");
        }
    }
    action() {
        this.game.addScore(0);
        this.game.character.hit = true;
        if (!document.querySelector(".anvilHit")) {
            document.getElementsByTagName("Anvil");
            this.anvilHit = document.createElement('div');
            this.anvilHit.classList.add('anvilHit');
            document.body.appendChild(this.anvilHit);
            this.anvilHit.style.transform = `translate(${this.game.character.posx - 80}px, ${this.game.character.posy - 200}px)`;
            setTimeout(() => { this.game.character._htmlElement.classList.remove("hit-character"); this.anvilHit.remove(); this.game.character.hit = false; }, 5000);
        }
    }
    notify() {
        this.element.remove();
        this.subject.unsubscribe(this);
        this.game.food.slice(this.game.food.indexOf(this), 1);
    }
}
