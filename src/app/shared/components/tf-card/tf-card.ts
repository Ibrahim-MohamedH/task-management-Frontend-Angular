import { Component, computed, contentChild, signal } from '@angular/core';
import { CardHeader } from '../../directives/cardheader';
import { CardFooter } from '../../directives/cardfooter';
@Component({
  selector: 'app-tf-card',
  imports: [],
  templateUrl: './tf-card.html',
  styleUrl: './tf-card.css',
})
export class TFCard {

header = contentChild(CardHeader);
footer = contentChild(CardFooter);

hasHeader = computed(() => !!this.header());
hasFooter = computed(() => !!this.footer());

titleClass = signal<String>('')
bodyclass = signal<String>('')
footerClass = signal<String>('')

}
