export class Walking {
    constructor(character) {
        this.character = character;
    }
    update() {
        this.character.speedRight = 5;
        this.character.speedLeft = -5;
    }
}
