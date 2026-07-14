import { Component, effect, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { Busy } from './core/services/settings/busy';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NgxSpinnerModule, TranslatePipe],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  spinner = inject(NgxSpinnerService);

  busy = inject(Busy);

  constructor() {
    effect(() => {
      if (this.busy.isBusy()) {
        this.spinner.show();
      } else {
        this.spinner.hide();
      }
    });
  }
}
