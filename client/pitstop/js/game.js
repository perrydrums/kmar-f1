import { Gas } from './gas.js';
import { Dialog } from './dialog.js';
import { Player } from './player.js';
import { Timer } from './timer.js';
import { Tire } from './tire.js';
import { Car } from './car.js';
export class Game {
    constructor() {
        this._fps = 30;
        this._carTime = 0;
        this.tires = [];
        this.running = false;
        this._fpsInterval = 1000 / this._fps;
        this._then = Date.now();
        this.spawnTires();
        this.player = new Player();
        this.gasmeter = new Gas();
        this.timer = new Timer();
        this.socket = io({ timeout: 60000 });
        this.socket.emit('pitstop:start', {
            uuid: this.getCookie('uuid'),
        });
        this.socket.on('server:gasoline:update', (data) => {
            console.log('PITSTOP: SERVER UPDATE', data.gasoline);
            this.gasmeter.addGasoline(data.gasoline);
        });
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
        const now = Date.now();
        const elapsed = now - this._then;
        if (this.running) {
            if (elapsed > this._fpsInterval) {
                this.player.update();
                this.gasmeter.update();
                this.timer.update();
                this.checkCar();
                this._then = now - (elapsed % this._fpsInterval);
            }
        }
        else {
            if (!this.dialog) {
                this.dialog = Dialog.getInstance();
                this.dialog.setHTML('<h1>KMar F1 - Pitstop</h1>' +
                    '<p>Jij bent verantwoordelijk voor de pitstop. Probeer de snelste tijd neer te zetten.</p>' +
                    '<p>Beweeg met de pijltjestoetsen en pak spullen vast met de spatiebalk.</p>' +
                    '<p>Zet de banden op de auto en vul de auto met benzine.</p>');
                this.dialog.addButton();
            }
        }
    }
    spawnTires() {
        for (let i = 0; i < 4; i++) {
            this.tires.push(new Tire());
        }
    }
    checkCar() {
        if (this._carTime > this._fps * 5) {
            if (!this._car) {
                this._car = new Car();
                this.timer.start();
            }
            this._carTime = 0;
        }
        this._carTime++;
        if (this._car) {
            this._car.update();
            if (this._car.done) {
                this._car = null;
                this.spawnTires();
                this.gasmeter.reset();
                this.timer.stop();
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
