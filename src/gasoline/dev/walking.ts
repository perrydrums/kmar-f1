import { Movement } from './movement.js';
import { Character } from './character.js';

export class Walking implements Movement {
    private character:Character

    constructor(character:Character){
       this.character = character
    }

    update(){
        this.character.speedRight = 10
        this.character.speedLeft = -10
    }
}