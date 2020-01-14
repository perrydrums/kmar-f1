export class Timer {
    constructor() {
        this.startTime = 20;
        this.timeIsUp = false;
        this.isRunning = false;
        this.element = document.getElementById('timer');
    }
    start() {
        this.time = this.startTime;
        if (!this.isRunning) {
            this.interval = setInterval(() => {
                if (this.time > 0) {
                    this.time--;
                }
                else {
                    this.isRunning = false;
                    console.log("timeisup");
                    this.timeIsUp = true;
                }
            }, 1000);
            this.isRunning = true;
        }
    }
    update() {
        this.element.innerHTML = this.time.toString();
    }
    reset() {
        this.time = this.startTime;
        this.isRunning = false;
    }
    isTimeIsUp() {
        if (this.timeIsUp == true) {
            return this.timeIsUp = true;
        }
    }
}
