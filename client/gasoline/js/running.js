export class Running {
    constructor(character) {
        this.character = character;
    }
    update() {
        this.character.speedRight = 20;
        this.character.speedLeft = -20;
    }
}
