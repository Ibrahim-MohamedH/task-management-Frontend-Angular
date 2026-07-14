import { computed, Injectable, signal } from '@angular/core';

@Injectable({
    providedIn:'root'
})
export class Busy {

    private readonly count = signal(0);

    readonly isBusy = computed(() => this.count() > 0);

    show() {
        this.count.update(v => v + 1);
    }

    hide() {
        this.count.update(v => Math.max(0, v - 1));
    }

}
