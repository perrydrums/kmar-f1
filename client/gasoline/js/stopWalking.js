export class StopWalking {
    constructor(character) {
        this.character = character;
    }
    update() {
        this.character.speedRight = 0;
        this.character.speedLeft = 0;
    }
}
