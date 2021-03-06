import {Car} from "./car.js"
import {Opponent} from "./opponent.js"
import {Dialog} from "./dialog.js"
import {Pitstop} from "./pitstop.js";
import {Message} from "./message.js";

export class Game {

    private static _instance: Game;

    private _fps: number = 30;

    private _fpsInterval: number;

    private _then: number;

    public _car: Car;

    private running: boolean = false;

    private dialog: Dialog;

    private opponentHit: HTMLImageElement;

    public sequenceCount: number = 0;

    public opponent: Opponent[] = [];

    public socket: SocketIOClient.Socket;

    private inPitstop: boolean = false;

    private pitstopObject: Pitstop;

    public startTime: number;

    public distance: number = 0;

    public speed: number = 1;

    private lap: number = 1;

    private lapTime: any = {};

    private lapText: string = 'Ronde 1 van 4';

    private scoreElement: HTMLElement;

    private distanceElement: HTMLElement;

    private speedElement: HTMLElement;

    private informationElement: HTMLElement;

    private currentMessage: Message;

    private turboUpgrade: boolean = false;

    /**
     * Make the constructor private.
     */
    private constructor() {
        this._fpsInterval = 1000 / this._fps;
        this._then = Date.now();
        this.createCar();

        this.socket = io({timeout: 60000});

        this.socket.emit('driver:start', {
            uuid: this.getCookie('uuid'),
        });

        this.socket.on('server:driver:upgrades', (data:any) => {
            if (data.upgrades['engine-upgrade']) this.speed += .3;
            if (data.upgrades['turbo-upgrade']) this.turboUpgrade = true;
            if (data.upgrades['aero-upgrade']) this.speed += .3;
        });

        this.socket.on('server:research:unlock:engine-upgrade', (data:any) => {
            this.currentMessage = new Message('Motor upgrade!', '+ 30% snelheid', 'good');
            this.speed += .3;
        });

        this.socket.on('server:research:unlock:turbo-upgrade', (data:any) => {
            this.currentMessage = new Message('Turbo upgrade!', 'Turbo geeft 2x meer snelheid!', 'good');
            this.turboUpgrade = true;
        });

        this.socket.on('server:research:unlock:aero-upgrade', (data:any) => {
            this.currentMessage = new Message('Aerodynamische upgrade!', '+ 30% snelheid', 'good');
            this.speed += .3;
        });

        this.socket.on('server:aero:boost', (data: any) => {
            this.currentMessage = new Message('Aerodynamische boost!', '+ 10% snelheid', 'good');
            this.speed += .1;
        });

        this.socket.on('server:aero:slow', (data: any) => {
            this.currentMessage = new Message('Aerodynamische slowdown!', '- 10% snelheid', 'bad');
            if (this.speed >= .3) {
                this.speed -= .1;
            }
        });

        this.socket.on('server:turbo:turbo', (data: any) => {
            this.currentMessage = new Message('TURBO', 'TURBOOOO', 'good');

            this.speed += this.turboUpgrade ? 1 : .5;

            setTimeout(() => {
                this.speed -= .5;
            }, 5000);
        });

        this.socket.on('server:pitstop:done', (data: any) => {
            this.lap++;
            this.lapText = 'Ronde ' + this.lap + ' van 4';
            this.scoreElement.innerText = this.lapText;
            this.startTime = Date.now();
            this.inPitstop = false;
            this.opponent.forEach(opponent => {
                opponent.remove();
            });
            this.opponent = [];
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

    public startGame(): void {
        this.running = true;
        this.startTime = Date.now();
    }

    public finish(): void {
        this.socket.emit('driver:finish');

        setTimeout(() => {
            window.location.href = '/finish';
        }, 3000);
    }

    /**
     * Runs approx. {this._fps} times a second.
     */
    gameLoop() {
        requestAnimationFrame(() => this.gameLoop());

        if (this.inPitstop) {
            this.pitstopObject = Pitstop.getInstance();
            this.pitstopObject.show();
            return;
        }

        // Calculate elapsed time.
        const now = Date.now();
        const elapsed = now - this._then;

        if (this.running) {
            // If enough time has elapsed, draw the next frame.
            if (elapsed > this._fpsInterval) {
                this.checkCollision();
                this._car.update();

                for (let o of this.opponent) {
                    o.update()
                }

                if (this.opponent.length <= 2) {
                    for (let opponent of this.spawnOpponent(2)) {
                        this.opponent.push(opponent)
                    }
                }

                this.distance += this.speed;
                this.distanceElement.innerHTML = this.distance < 1000 ? 'Resterend aantal meter:  ' + (1000 - this.distance).toFixed().toString() : '';
                this.speedElement.innerHTML = this.distance < 1000 ? (this.speed * 200).toFixed(0).toString() + ' km/u' : '0';

                if (this.distance > 1000) {
                    if (this.lap >= 4) {
                        this.finish();
                    } else {
                        this.pitstop();
                        this.distance = 0;
                    }
                }

                // Get ready for next frame by setting then=now, but...
                // Also, adjust for fpsInterval not being multiple of 16.67
                this._then = now - (elapsed % this._fpsInterval);
            }
        } else {
            if (!this.dialog) {
                this.dialog = Dialog.getInstance();
                this.dialog.setHTML(
                    '<h1>KMar F1 - Driver</h1>' +
                    '<p>Jij bent de coureur. Probeer zo veel mogelijk tegenstanders te ontwijken.</p>' +
                    '<p>Beweeg de auto met de pijltjestoetsen.</p>'
                );
                this.dialog.addButton();
            }
        }
    }

    private spawnOpponent(amount: number): Opponent[] {
        let opponent: Opponent[] = [];
        for (let i = 0; i < amount; i++) {
            opponent.push(new Opponent())
        }
        return opponent;
    }

    /**
     * Create caracter
     */
    private createCar() {
        this._car = new Car();
    }

    private pitstop() {
        this.lapTime[this.lap] = Date.now() - this.startTime;
        console.log(this.lapTime);
        this.inPitstop = true;

        this.setAnimationState('paused');

        this.socket.emit('driver:lap', {
            lap: this.lap,
            time: this.lapTime,
        });
    }

    private checkCollision() {
        for (let i = 0; i < this.opponent.length; i++) {
            if (
                !this._car.hit &&
                this._car._element.getBoundingClientRect().left+20 < this.opponent[i].element.getBoundingClientRect().right &&
                this._car._element.getBoundingClientRect().right-20 > this.opponent[i].element.getBoundingClientRect().left &&
                this._car._element.getBoundingClientRect().bottom-30 > this.opponent[i].element.getBoundingClientRect().top &&
                this._car._element.getBoundingClientRect().top+30 < this.opponent[i].element.getBoundingClientRect().bottom
            ) {
                if (!document.querySelector('.opponentHit')) {
                    this._car.hit = true;
                    const oldSpeed = this.speed;
                    this.speed = 0;
                    this.setAnimationState('paused');

                    const opponentHitWrapper = document.createElement('div');
                    opponentHitWrapper.id = 'opponentHitWrapper';
                    this.opponentHit = document.createElement('img');
                    this.opponentHit.classList.add('opponentHit');
                    this.opponentHit.src = "";
                    this.opponentHit.src = "./img/explosion.gif?a=" + Math.random().toString();
                    this.opponentHit.style.transform = `translate(${this._car.posX - 80}px, ${this._car.posY}px)`;
                    this._car._element.classList.add('blinking');

                    this.opponent[i]._element.remove();

                    opponentHitWrapper.appendChild(this.opponentHit);
                    document.body.appendChild(opponentHitWrapper);

                    setTimeout(() => {
                        document.getElementById('opponentHitWrapper').remove();
                        this._car.hit = false;
                        this._car._element.classList.remove('blinking');
                        this.speed = oldSpeed;
                        this.setAnimationState('running');
                    }, 3000);
                }
            }
        }
    }

    public setAnimationState(state: string): void {
        const kerbs = document.querySelectorAll('.kerb');
        const lines = document.querySelectorAll('.line');

        kerbs.forEach((kerb: HTMLElement) => {
            kerb.style.webkitAnimationPlayState = state;
        });

        lines.forEach((line: HTMLElement) => {
            line.style.webkitAnimationPlayState = state;
        });
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
