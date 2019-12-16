import { Dialog } from './dialog.js';
import { UpgradeScreen } from './upgradeScreen.js';
import { Puzzle } from './puzzle.js';
export class Game {
    constructor() {
        this.completed = {};
        this.upgrade = UpgradeScreen.getInstance();
        this.upgrade.show();
        this.socket = io();
        this.socket.emit('research:start', {
            uuid: this.getCookie('uuid'),
        });
        this.socket.on('server:research:update', (data) => {
            this.completed = data.upgrades;
        });
        this.gameLoop();
    }
    static getInstance() {
        if (!this._instance) {
            this._instance = new Game();
        }
        return this._instance;
    }
    newPuzzle(upgrade) {
        this.puzzle = new Puzzle(upgrade);
        this.puzzle.show();
    }
    unlock(upgrade) {
        this.completed[upgrade.getName()] = true;
        upgrade.unlockButton();
        this.socket.emit('research:unlock', { upgrade: upgrade.getName() });
    }
    startGame() {
    }
    gameLoop() {
        requestAnimationFrame(() => this.gameLoop());
        if (!this.dialog) {
            this.dialog = Dialog.getInstance();
            this.dialog.setHTML('<h1>KMar F1 - Research & Development</h1>' +
                '<p>Jij bent verantwoordelijk voor de pitstop. Probeer de snelste tijd neer te zetten.</p>' +
                '<p>Beweeg met de pijltjestoetsen en pak spullen vast met de spatiebalk.</p>' +
                '<p>Zet de banden op de auto en vul de auto met benzine.</p>');
            this.dialog.addButton();
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
