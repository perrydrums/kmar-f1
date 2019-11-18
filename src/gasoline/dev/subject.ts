import { Observer } from './observer.js';

export interface Subject {
    observers:Observer[]
    subscribe(c: Observer):void
    unsubscribe(c: Observer):void
    update():void
}