import { Car } from "./car.js";
import { Opponent } from "./opponent.js";
import { Dialog } from "./dialog.js";
import { Pitstop } from "./pitstop.js";
export class Game {
    constructor() {
        this._fps = 30;
        this._carTime = 0;
        this.running = false;
        this.sequenceCount = 0;
        this.opponent = [];
        this.inPitstop = false;
        this.distance = 0;
        this.lap = 1;
        this.lapText = 'Ronde 1 van 4';
        this._fpsInterval = 1000 / this._fps;
        this._then = Date.now();
        this.createCar();
        this.startTime = Date.now();
        this.socket = io({ timeout: 60000 });
        this.socket.emit('driver:start', {
            uuid: this.getCookie('uuid'),
        });
        this.socket.on('server:aero:boost', data => {
            console.log('BOOST!');
        });
        this.socket.on('server:pitstop:done', data => {
            this.lap++;
            this.lapText = 'Ronde ' + this.lap + ' van 4';
            this.scoreElement.innerText = this.lapText;
            this.inPitstop = false;
            this.pitstopObject.hide();
            this.pitstopObject = null;
        });
        this.scoreElement = document.createElement('div');
        this.scoreElement.classList.add('lap');
        this.scoreElement.innerText = this.lapText;
        document.body.appendChild(this.scoreElement);
        this.gameLoop();
    }
    static getInstance() {
        if (!this._instance) {
            this._instance = new Game();
        }
        return this._instance;
    }
    startGame() {
        this.running = true;
    }
    gameLoop() {
        requestAnimationFrame(() => this.gameLoop());
        if (this.inPitstop) {
            this.pitstopObject = Pitstop.getInstance();
            this.pitstopObject.show();
            return;
        }
        const now = Date.now();
        const elapsed = now - this._then;
        if (this.running) {
            if (elapsed > this._fpsInterval) {
                this.checkCollision();
                this._car.update();
                for (let o of this.opponent) {
                    o.update();
                }
                if (this.opponent.length <= 2) {
                    for (let opponent of this.spawnOpponent(2)) {
                        this.opponent.push(opponent);
                    }
                }
                this.distance++;
                if (this.distance > 100) {
                    this.pitstop();
                    this.distance = 0;
                }
                this._then = now - (elapsed % this._fpsInterval);
            }
        }
        else {
            if (!this.dialog) {
                this.dialog = Dialog.getInstance();
                this.dialog.setHTML('<h1>KMar F1 - Aerodynamica</h1>' +
                    '<p>Jij bent verantwoordelijk voor de pitstop. Probeer de snelste tijd neer te zetten.</p>' +
                    '<p>Beweeg met de pijltjestoetsen en pak spullen vast met de spatiebalk.</p>' +
                    '<p>Zet de banden op de auto en vul de auto met benzine.</p>');
                this.dialog.addButton();
            }
        }
    }
    spawnOpponent(amount) {
        let opponent = [];
        for (let i = 0; i < amount; i++) {
            opponent.push(new Opponent());
        }
        return opponent;
    }
    createCar() {
        this._car = new Car();
    }
    pitstop() {
        this.socket.emit('driver:pitstop');
        this.inPitstop = true;
    }
    checkCollision() {
        for (let i = 0; i < this.opponent.length; i++) {
            if (this._car._element.getBoundingClientRect().left < this.opponent[i].element.getBoundingClientRect().right &&
                this._car._element.getBoundingClientRect().right > this.opponent[i].element.getBoundingClientRect().left &&
                this._car._element.getBoundingClientRect().bottom > this.opponent[i].element.getBoundingClientRect().top &&
                this._car._element.getBoundingClientRect().top < this.opponent[i].element.getBoundingClientRect().bottom) {
                if (!document.querySelector('.opponentHit')) {
                    this.opponentHit = document.createElement('img');
                    this.opponentHit.classList.add('opponentHit');
                    this.opponentHit.src = "";
                    this.opponentHit.src = "./img/explosion.gif";
                    document.body.appendChild(this.opponentHit);
                    this.opponentHit.style.transform = `translate(${this._car.posX - 80}px, ${this._car.posY}px)`;
                    setTimeout(() => {
                        this.opponentHit.remove();
                        this._car.hit = false;
                    }, 5000);
                }
            }
        }
    }
    spawnOpponent(amount) {
        let opponent = [];
        for (let i = 0; i < amount; i++) {
            opponent.push(new Opponent());
        }
        return opponent;
    }
    checkCar() {
        if (this._carTime > this._fps * 0) {
            if (!this._car) {
                this._car = new Car();
                this.opponentHit.style.transform = `translate(${this._car.posX - 80}px, ${this._car.posY}px)`;
                setTimeout(() => { this.opponentHit.classList.remove('opponentHit'); this.opponentHit.remove(); console.log('timeout klaar'); }, 4000);
            }
        }
    }
    getCookie(name) {
        const value = "; " + document.cookie;
        const parts = value.split("; " + name + "=");
        if (parts.length == 2)
            return parts.pop().split(";").shift();
    }
}
window.addEventListener("load", () => {
    Game.getInstance();
});
