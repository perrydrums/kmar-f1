import {Game} from './game.js';
import {Quiz} from './quiz.js';

export class Timer {

    private element:HTMLElement;
    private interval;
    public startTime:number = 20;
    public time:number;
    public game:Game;
    public quiz:Quiz;
    public timeIsUp:boolean = false;
    public isRunning:boolean = false;
    public nextQuestionId:Game;
  
    public constructor() {
      this.element = document.getElementById('timer');
    }
    
    /**
     * Start the timer
     */
    public start() {
        this.time = this.startTime;
        if (!this.isRunning) {
            this.interval = setInterval(() => {
                if(this.time > 0) {
                    this.time--;
                } else {
                    this.isRunning = false;
                    console.log("timeisup");
                    this.timeIsUp = true;
                }
              },1000);
            this.isRunning = true;
        }
    }

    /**
     * Update the timer's HTML.
     */
    public update() {
        this.element.innerHTML = this.time.toString();
    }

    public reset() {
        this.time = this.startTime;
        this.isRunning = false;
    }

    // // TODO: werkt niet
    // public pause() {
    //     setTimeout(() => {
    //         this.isRunning = false;
    //     }, 1000)
    // }

    public isTimeIsUp () : boolean {
        if (this.timeIsUp == true) {
            return this.timeIsUp = true;
        }
    }
  }