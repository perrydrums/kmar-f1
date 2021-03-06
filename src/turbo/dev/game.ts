import {Observer} from './interfaces/observer.js';
import {Vehicle} from './vehicle.js';
import {Dialog} from './dialog.js';
import {Subject} from './interfaces/subject.js';
import {Truck} from './truck.js';
import {Speed} from './speed.js';
import {Car} from './car.js';
import {MasherGame} from './masherGame.js';

export class Game implements Observer {

    public vehicle: Vehicle [] = [];
    private static instance: Game;
    private speedSubject: Subject;
    private dialog: Dialog;
    private running: boolean = false;
    private masher: MasherGame = null;
    private complete: boolean = false;
    public turboCount: number = 0;
    public socket: SocketIOClient.Socket;

    private constructor() {
        this.socket = io({timeout: 60000});

        this.socket.emit('turbo:start', {
            uuid: this.getCookie('uuid'),
        });

        this.socket.on('finish', (data:any) => {
            window.location.href = '/finish';
        });
    }

    public initialize(): void {
        this.speedSubject = new Speed();
        this.speedSubject.subscribe(this);
        this.showWord();
        this.vehicle = [new Truck(this.speedSubject), new Car()];
        this.gameLoop();
    }

    public static getInstance(): Game {
        if (!this.instance) {
            this.instance = new Game();
        }
        return this.instance;
    }

    public generateRandom(): number {
        return Math.floor(Math.random() * (90 - 65 + 1) + 65);
    }

    public randomWord(): string {
        const wordArray = ["marechaussee", "kmar", "schiphol", "drugs", "paspoort", "tobs", "kazerne", "veiligheid", "nederland", "grenscontrole", "defensie", "commandant", "baret", "controle", "paresto", "wapen", "wapendag", "koninklijke", "criminaliteit", "terrorisme" ];
        return wordArray[Math.floor(Math.random() * wordArray.length)];
    }

    private showWord(): void {
        let word = document.createElement("div");
        word.setAttribute("id", "word");
        document.body.appendChild(word);
    }

    public setWord(word: string): void {
        const splitted = word.split('');
        let addToHTML = '';
        splitted.forEach(letter =>
            addToHTML += '<span>' + letter + '</span>');
        document.getElementById("word").innerHTML = addToHTML;
    }

    public winner(v: Vehicle): void {
        if (v instanceof Car) {
            this.masher = MasherGame.getInstance();
            this.masher.show();
        } else if (v instanceof Truck) {
            window.location.reload();
        }
    }

    public turbo(): void {
        if (this.turboCount == 0){
            this.socket.emit('turbo:turbo');
            this.turboCount = 1;
        }

        setTimeout(() => {
            location.reload();
        }, 3000);
    }

    public startGame() {
        this.running = true;
    }

    public stopGame() {
        this.vehicle.forEach(vehicle => {
            vehicle.posx = 0;
        });
        this.running = false;
    }

    private gameLoop(): void {
        requestAnimationFrame(() => this.gameLoop());
        window.addEventListener("keydown", (e:KeyboardEvent) => this.onKeyDown(e));

        if (this.running) {
            for (let v of this.vehicle) {
                v.update();
                v.checkCollision();
            }
            this.speedSubject.update();
        } else if (this.masher && !this.complete) {
            if (this.masher.update()) {
                this.complete = true;
            }
        } else {
            if (!this.dialog) {
                this.dialog = Dialog.getInstance();
                this.dialog.setHTML(
                    '<h1>KMar F1 - Turbo</h1>' +
                    '<p>Jij bent verantwoordelijk voor de turbo. Probeer zo snel mogelijk de woorden in te typen die in het beeld verschijnen.</p>' +
                    '<p>Let op, door verkeerde aanslagen gaat je auto achteruit! Bij typ fouten hoeft de backspace knop niet ingedrukt te worden.</p>' +
                    '<p>Probeer van de oranje bus te winnen!</p>'
                );
                this.dialog.addButton();
            }
        }

    }

    public onKeyDown(event:KeyboardEvent):void {
        if (event.keyCode == 8) {
            event.preventDefault();
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

    notify(p: number): void {
        // Leeg.
    }

}

window.addEventListener("load", () => {
    const g = Game.getInstance();
    g.initialize();
});
