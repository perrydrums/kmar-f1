import {Dialog} from './dialog.js'
import {UpgradeScreen} from './upgradeScreen.js'
import {Puzzle} from './puzzle.js';
import {Upgrade} from './upgrade.js';

export class Game {

    private static _instance: Game;
    private dialog: Dialog;
    private upgrade: UpgradeScreen;
    private puzzle: Puzzle;
    private socket: SocketIOClient.Socket;
    public completed: any = {};

    /**
     * Make the constructor private.
     */
    private constructor() {
        this.upgrade = UpgradeScreen.getInstance();
        this.upgrade.show();

        this.socket = io();

        this.socket.emit('research:start', {
            uuid: this.getCookie('uuid'),
        });

        // Update the buttons if they're unlocked.
        this.socket.on('server:research:update', (data: any) => {
            this.completed = data.upgrades;
        });

        this.socket.on('finish', (data:any) => {
            window.location.href = '/finish';
        });

        this.gameLoop();
    }

    /**
     * There can always only be one Game instance.
     *
     * @returns {Game}
     */
    public static getInstance(): Game {
        if (!this._instance) {
            this._instance = new Game();
        }
        return this._instance;
    }

    /**
     * Creates a new puzzle.
     *
     * @param upgrade
     */
    public newPuzzle(upgrade: Upgrade): void {
        this.puzzle = new Puzzle(upgrade);
        this.puzzle.show();
    }

    /**
     * Unlocks the upgrade of set level.
     *
     * @param {Upgrade} upgrade
     */
    public unlock(upgrade: Upgrade): void {
        this.completed[upgrade.getName()] = true;
        upgrade.unlockButton();

        this.socket.emit('research:unlock', {upgrade: upgrade.getName()});
    }

    public startGame(): void {

    }

    /**
     * Runs approx. {this._fps} times a second.
     */
    gameLoop() {
        requestAnimationFrame(() => this.gameLoop());

        if (!this.dialog) {
            this.dialog = Dialog.getInstance();
            this.dialog.setHTML(
                '<h1>KMar F1 - Research & Development</h1>' +
                '<p>Jij bent verantwoordelijk voor de upgrades. Klik op de rondjes om een andere afbeelding te kiezen.</p>' +
                '<p>Wanneer je de puzzel niet haalt binnen de 4 pogingen ga je terug naar het overzicht.</p>'
            );
            this.dialog.addButton();
        }
    }

    /**
     * Get cookie by name.
     *
     * @param name
     */
    private getCookie(name: string) {
        const value = "; " + document.cookie;
        const parts = value.split("; " + name + "=");
        if (parts.length == 2) return parts.pop().split(";").shift();
        return null;
    }

}

window.addEventListener("load", () => {
    Game.getInstance()
});
