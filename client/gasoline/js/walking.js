export class Walking {
    constructor(character) {
        this.character = character;
    }
    update() {
        this.character.speedRight = 10;
        this.character.speedLeft = -10;
    }
}
