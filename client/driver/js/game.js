import { Car } from "./car.js";
import { Opponent } from "./opponent.js";
import { Dialog } from "./dialog.js";
import { Pitstop } from "./pitstop.js";
import { Message } from "./message.js";
export class Game {
    constructor() {
        this._fps = 30;
        this.running = false;
        this.sequenceCount = 0;
        this.opponent = [];
        this.inPitstop = false;
        this.distance = 0;
        this.speed = 1;
        this.lap = 1;
        this.lapTime = {};
        this.lapText = 'Ronde 1 van 4';
        this.turboUpgrade = false;
        this._fpsInterval = 1000 / this._fps;
        this._then = Date.now();
        this.createCar();
        this.socket = io({ timeout: 60000 });
        this.socket.emit('driver:start', {
            uuid: this.getCookie('uuid'),
        });
        this.socket.on('server:driver:upgrades', (data) => {
            if (data.upgrades['engine-upgrade'])
                this.speed += .3;
            if (data.upgrades['turbo-upgrade'])
                this.turboUpgrade = true;
            if (data.upgrades['aero-upgrade'])
                this.speed += .3;
        });
        this.socket.on('server:research:unlock:engine-upgrade', (data) => {
            this.currentMessage = new Message('Motor upgrade!', '+ 30% snelheid', 'good');
            this.speed += .3;
        });
        this.socket.on('server:research:unlock:turbo-upgrade', (data) => {
            this.currentMessage = new Message('Turbo upgrade!', 'Turbo geeft 2x meer snelheid!', 'good');
            this.turboUpgrade = true;
        });
        this.socket.on('server:research:unlock:aero-upgrade', (data) => {
            this.currentMessage = new Message('Aerodynamische upgrade!', '+ 30% snelheid', 'good');
            this.speed += .3;
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
        this.socket.on('server:turbo:turbo', (data) => {
            this.currentMessage = new Message('TURBO', 'TURBOOOO', 'good');
            this.speed += this.turboUpgrade ? 1 : .5;
            setTimeout(() => {
                this.speed -= .5;
            }, 5000);
        });
        this.socket.on('server:pitstop:done', (data) => {
            this.lap++;
            this.lapText = 'Ronde ' + this.lap + ' van 4';
            this.scoreElement.innerText = this.lapText;
            this.startTime = Date.now();
            this.inPitstop = false;
            this.pitstopObject.hide();
            this.pitstopObject = null;
            this.setAnimationState('running');
        });
        this.informationElement = document.createElement('div');
        this.informationElement.classList.add('information');
        document.body.appendChild(this.informationElement);
        this.scoreElement = document.createElement('div');
        this.scoreElement.classList.add('lap');
        this.scoreElement.innerText = this.lapText;
        this.informationElement.appendChild(this.scoreElement);
        this.distanceElement = document.createElement('div');
        this.distanceElement.classList.add('distance');
        this.informationElement.appendChild(this.distanceElement);
        this.speedElement = document.createElement('div');
        this.speedElement.classList.add('distance');
        this.informationElement.appendChild(this.speedElement);
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
        this.socket.emit('finish');
        window.location.href = '/finish';
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
                this.distanceElement.innerHTML = this.distance < 1000 ? 'Resterend aantal meter:  ' + (1000 - this.distance).toFixed().toString() : '';
                this.speedElement.innerHTML = this.distance < 1000 ? (this.speed * 200).toFixed(0).toString() + ' km/u' : '0';
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
                this.dialog.setHTML('<h1>KMar F1 - Driver</h1>' +
                    '<p>Jij bent de coureur. Probeer zo veel mogelijk tegenstanders te ontwijken.</p>' +
                    '<p>Beweeg de auto met de pijltjestoetsen en pak spullen vast met de spatiebalk.</p>');
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
        this.inPitstop = true;
        this.setAnimationState('paused');
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
                    const oldSpeed = this.speed;
                    this.speed = 0;
                    this.setAnimationState('paused');
                    this.opponentHit = document.createElement('img');
                    this.opponentHit.classList.add('opponentHit');
                    this.opponentHit.src = "";
                    this.opponentHit.src = "./img/explosion.gif";
                    document.body.appendChild(this.opponentHit);
                    this.opponentHit.style.transform = `translate(${this._car.posX - 80}px, ${this._car.posY}px)`;
                    this._car._element.classList.add('blinking');
                    this.opponent[i]._element.remove();
                    setTimeout(() => {
                        this.opponentHit.remove();
                        this._car.hit = false;
                        this._car._element.classList.remove('blinking');
                        this.speed = oldSpeed;
                        this.setAnimationState('running');
                    }, 3000);
                }
            }
        }
    }
    setAnimationState(state) {
        const kerbs = document.querySelectorAll('.kerb');
        const lines = document.querySelectorAll('.line');
        kerbs.forEach((kerb) => {
            kerb.style.webkitAnimationPlayState = state;
        });
        lines.forEach((line) => {
            line.style.webkitAnimationPlayState = state;
        });
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
