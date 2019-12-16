import {Observer} from './observer.js';

export interface Subject {
    observers: Observer[]

    subscribe(c: Observer): void

    update(): void
}
