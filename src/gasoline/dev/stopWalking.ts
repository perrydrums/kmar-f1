import { Movement } from './movement.js';
import { Character } from './character.js';

export class StopWalking implements Movement {
    private character:Character

    constructor(character:Character){
       this.character = character
    }

    update(){
        this.character.speedRight = 0
        this.character.speedLeft = 0
    }
}