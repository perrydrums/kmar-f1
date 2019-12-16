import { Car } from "./car.js";
import { Opponent } from "./opponent.js";
import { Dialog } from "./dialog.js";
import { Pitstop } from "./pitstop.js";
import { Message } from "./message.js";
export class Game {
    constructor() {
        this._fps = 30;
        this._carTime = 0;
        this.running = false;
        this.sequenceCount = 0;
        this.opponent = [];
        this.inPitstop = false;
        this.distance = 0;
        this.speed = 1;
        this.lap = 1;
        this.lapTime = {};
        this._fpsInterval = 1000 / this._fps;
        this._then = Date.now();
        this.createCar();
        this.socket = io({ timeout: 60000 });
        this.socket.emit('driver:start', {
            uuid: this.getCookie('uuid'),
        });
        this.socket.on('server:aero:boost', (data) => {
            this.currentMessage = new Message('Aerodynamische boost!', '+ 10% snelheid', 'good');
            this.speed += .1;
        });
        this.socket.on('server:aero:slow', (data) => {
            this.currentMessage = new Message('Aerodynamische slowdown!', '- 10% snelheid', 'bad');
            if (this.speed >= .3) {
                this.speed -= .1;
            }
        });
        this.socket.on('server:pitstop:done', (data) => {
            this.lap++;
            this.startTime = Date.now();
            this.scoreElement.innerText = this.lap.toString();
            this.inPitstop = false;
            this.pitstopObject.hide();
            this.pitstopObject = null;
        });
        this.scoreElement = document.createElement('div');
        this.scoreElement.classList.add('lap');
        this.scoreElement.innerText = this.lap.toString();
        document.body.appendChild(this.scoreElement);
        this.distanceElement = document.createElement('div');
        this.distanceElement.classList.add('distance');
        document.body.appendChild(this.distanceElement);
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
        this.startTime = Date.now();
    }
    finish() {
        console.log('RACE FINISHED!!!');
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
                this.distance += this.speed;
                this.distanceElement.innerHTML = this.distance < 1000 ? (1000 - this.distance).toFixed(0).toString() + '<br>' + (this.speed * 200).toFixed(0).toString() + ' km/h' : '0';
                if (this.distance > 1000) {
                    if (this.lap >= 4) {
                        this.finish();
                    }
                    else {
                        this.pitstop();
                        this.distance = 0;
                    }
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
        this.lapTime[this.lap] = Date.now() - this.startTime;
        console.log(this.lapTime);
        this.socket.emit('driver:pitstop');
        this.inPitstop = true;
        this.socket.emit('driver:lap', {
            lap: this.lap,
            time: this.lapTime,
        });
    }
    checkCollision() {
        for (let i = 0; i < this.opponent.length; i++) {
            if (!this._car.hit &&
                this._car._element.getBoundingClientRect().left < this.opponent[i].element.getBoundingClientRect().right &&
                this._car._element.getBoundingClientRect().right > this.opponent[i].element.getBoundingClientRect().left &&
                this._car._element.getBoundingClientRect().bottom > this.opponent[i].element.getBoundingClientRect().top &&
                this._car._element.getBoundingClientRect().top < this.opponent[i].element.getBoundingClientRect().bottom) {
                if (!document.querySelector('.opponentHit')) {
                    this._car.hit = true;
                    this.speed -= .1;
                    this.opponentHit = document.createElement('div');
                    this.opponentHit.classList.add('opponentHit');
                    document.body.appendChild(this.opponentHit);
                    this.opponentHit.style.transform = `translate(${this._car.posX - 80}px, ${this._car.posY - 200}px)`;
                    this._car._element.classList.add('blinking');
                    setTimeout(() => {
                        this.opponentHit.remove();
                        this._car.hit = false;
                        this._car._element.classList.remove('blinking');
                    }, 3000);
                }
            }
        }
    }
    getCookie(name) {
        const value = "; " + document.cookie;
        const parts = value.split("; " + name + "=");
        if (parts.length == 2)
            return parts.pop().split(";").shift();
        return null;
    }
}
window.addEventListener("load", () => {
    Game.getInstance();
});
