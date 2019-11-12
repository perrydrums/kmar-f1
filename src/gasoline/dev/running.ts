import { Movement } from './movement.js';
import { Character } from './character.js';

export class Running implements Movement {
    private character:Character

    constructor(character:Character){
       this.character = character
    }

    public update(){
        this.character.speedRight = 20
        this.character.speedLeft = -20
    }
}