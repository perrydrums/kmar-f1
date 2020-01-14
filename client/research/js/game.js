import { Dialog } from './dialog.js';
import { UpgradeScreen } from './upgradeScreen.js';
import { Puzzle } from './puzzle.js';
export class Game {
    constructor() {
        this.tokens = 1;
        this.completed = {};
        this.upgrade = UpgradeScreen.getInstance();
        this.upgrade.show();
        this.socket = io();
        this.socket.emit('research:start', {
            uuid: this.getCookie('uuid'),
        });
        this.socket.on('server:research:update', (data) => {
            this.completed = data.upgrades;
            if (data.tokens) {
                this.tokens = data.tokens;
            }
        });
        this.socket.on('server:sponsor:update-tokens', (data) => {
            this.tokens = data.tokens;
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
    newPuzzle(upgrade) {
        this.puzzle = new Puzzle(upgrade);
        this.puzzle.show();
    }
    unlock(upgrade) {
        this.completed[upgrade.getName()] = true;
        upgrade.unlockButton();
        this.socket.emit('research:unlock', { upgrade: upgrade.getName() });
    }
    getTokens() {
        return this.tokens;
    }
    spendTokens(amount) {
        this.tokens -= amount;
    }
    gameLoop() {
        requestAnimationFrame(() => this.gameLoop());
        if (this.tokens) {
            document.getElementById('tokens').innerText = 'Upgrade tokens: ' + this.tokens.toString();
        }
        if (!this.dialog) {
            this.dialog = Dialog.getInstance();
            this.dialog.setHTML('<h1>KMar F1 - Research & Development</h1>' +
                '<p>Jij bent verantwoordelijk voor de upgrades. Klik op de rondjes om een andere afbeelding te kiezen.</p>' +
                '<p>Wanneer je de puzzel niet haalt binnen de 4 pogingen ga je terug naar het overzicht.</p>');
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
