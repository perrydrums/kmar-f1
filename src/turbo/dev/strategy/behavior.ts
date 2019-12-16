import {Car} from '../car.js';

export interface Behavior {
    car: Car

    update(): void
}
