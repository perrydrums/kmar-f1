import { Dialog } from './dialog.js';
import { Truck } from './truck.js';
import { Speed } from './speed.js';
import { Car } from './car.js';
import { MasherGame } from './masherGame.js';
export class Game {
    constructor() {
        this.vehicle = [];
        this.running = false;
        this.masher = null;
        this.complete = false;
        this.socket = io({ timeout: 60000 });
        this.socket.emit('turbo:start', {
            uuid: this.getCookie('uuid'),
        });
    }
    initialize() {
        this.speedSubject = new Speed();
        this.speedSubject.subscribe(this);
        this.showWord();
        this.showSpeed();
        this.vehicle = [new Truck(this.speedSubject), new Car()];
        this.gameLoop();
    }
    static getInstance() {
        if (!this.instance) {
            this.instance = new Game();
        }
        return this.instance;
    }
    generateRandom() {
        return Math.floor(Math.random() * (90 - 65 + 1) + 65);
    }
    randomWord() {
        const wordArray = ["marechaussee", "kmar", "schiphol", "drugs", "paspoort", "tobs", "kazerne", "veiligheid", "nederland", "grenscontrole", "informatie", "defensie", "commandant", "baret", "controle", "paresto", "wapen", "wapendag"];
        return wordArray[Math.floor(Math.random() * wordArray.length)];
    }
    showWord() {
        let word = document.createElement("div");
        word.setAttribute("id", "word");
        document.body.appendChild(word);
    }
    showSpeed() {
        this.extraSpeedElement = document.createElement("speed");
        this.extraSpeedElement.setAttribute("id", "extraSpeed");
        document.body.appendChild(this.extraSpeedElement);
    }
    setWord(word) {
        const splitted = word.split('');
        let addToHTML = '';
        splitted.forEach(letter => addToHTML += '<span>' + letter + '</span>');
        document.getElementById("word").innerHTML = addToHTML;
    }
    winner(v) {
        if (v instanceof Car) {
            this.masher = MasherGame.getInstance();
            this.masher.show();
        }
        else if (v instanceof Truck) {
            window.location.reload();
        }
    }
    turbo() {
        this.socket.emit('turbo:turbo');
        setTimeout(() => {
            location.reload();
        }, 3000);
    }
    startGame() {
        this.running = true;
    }
    stopGame() {
        this.vehicle.forEach(vehicle => {
            vehicle.posx = 0;
        });
        this.running = false;
    }
    gameLoop() {
        requestAnimationFrame(() => this.gameLoop());
        if (this.running) {
            for (let v of this.vehicle) {
                v.update();
                v.checkCollision();
            }
            this.speedSubject.update();
        }
        else if (this.masher && !this.complete) {
            if (this.masher.update()) {
                this.complete = true;
            }
        }
        else {
            if (!this.dialog) {
                this.dialog = Dialog.getInstance();
                this.dialog.setHTML('<h1>KMar F1 - Turbo</h1>' +
                    '<p>Jij bent verantwoordelijk voor de turbo. Probeer zo snel mogelijk de woorden in te typen die in het beeld verschijnen.</p>' +
                    '<p>Let op, door verkeerde aanslagen gaat je auto achteruit!</p>' +
                    '<p>Probeer van de oranje bus te winnen!</p>');
                this.dialog.addButton();
            }
        }
    }
    notify(p) {
        let speed = Math.floor(p * 2) + 90;
        this.extraSpeedElement.innerHTML = speed.toString() + " km/u";
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
    const g = Game.getInstance();
    g.initialize();
});
