import { Gas } from './gas.js';
import { Dialog } from './dialog.js';
import { Player } from './player.js';
import { Timer } from './timer.js';
import { Tire } from './tire.js';
import { Car } from './car.js';
import { RainTire } from './rainTire.js';
export class Game {
    constructor() {
        this._fps = 30;
        this.tires = [];
        this.running = false;
        this.pitstopTimes = {};
        this._fpsInterval = 1000 / this._fps;
        this._then = Date.now();
        this.player = new Player();
        this.gasmeter = new Gas();
        this.timer = new Timer();
        this.socket = io({ timeout: 60000 });
        this.socket.emit('pitstop:start', {
            uuid: this.getCookie('uuid'),
        });
        this.socket.on('server:gasoline:update', (data) => {
            if (data.gasoline)
                this.gasmeter.addGasoline(data.gasoline);
            if (data.tire)
                this.addTire();
            if (data.rainTire)
                this.addTire(true);
        });
        this.socket.on('server:driver:pitstop', (data) => {
            this.currentLap = data.lap;
            if (!this._car) {
                this._car = new Car();
                this.timer.start();
            }
        });
        this.socket.on('finish', (data) => {
            window.location.href = '/finish';
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
                    '<p>Zet 4 banden op de auto en vul de auto met benzine.</p>');
                this.dialog.addButton();
            }
        }
    }
    addTire(isRainTire = false) {
        let tireCount = 0;
        let rainTireCount = 0;
        this.tires.forEach((tire) => {
            tire instanceof RainTire ? rainTireCount++ : tireCount++;
        });
        if (isRainTire && rainTireCount < 4) {
            this.tires.push(new RainTire());
        }
        else if (!isRainTire && tireCount < 4) {
            this.tires.push(new Tire());
        }
    }
    checkCar() {
        if (this._car) {
            this._car.update();
            if (this._car.done) {
                this._car = null;
                this.timer.stop();
                this.pitstopTimes[this.currentLap] = this.timer.getTime();
                this.socket.emit('pitstop:done', { time: this.pitstopTimes });
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
