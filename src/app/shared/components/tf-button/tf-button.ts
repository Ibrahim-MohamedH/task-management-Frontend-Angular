import { Component, inject, input } from '@angular/core';
import { AppService } from '../../../core/services/app';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-tf-button',
  imports: [TranslatePipe],
  templateUrl: './tf-button.html',
  styleUrl: './tf-button.css',
})
export class TfButton {
  public appService = inject(AppService)

  type = input.required<'button' | 'submit' | 'reset'>();
  label = input<string>('');
  variant = input<
    'primary' | 'secondary' | 'blue' | 'outline' | 'ghost' | 'danger' | 'black' | 'white'
  >('primary');
  disabled = input<boolean>(false);
  loading = input<boolean>(false);
  icon = input<any>('');
  iconPosition = input<'start' | 'end'>('start');
  iconStyle = input<string>('');
  iconClass = input<string>('');
  background = input<string>('');
  color = input<string>('');
  buttonClass = input<string>('');
  labelClass = input<string>('');
  loadingText = input<string>('');

  computeClasses(): string {
    const base = [];

    if (this.disabled()) {
      base.push('opacity-60', 'cursor-not-allowed');
    }

    if (this.background() || this.color()) {
      base.push('border', 'border-transparent');
      return [
        ...base,
        this.background() ? '' : 'bg-gray-500',
        this.color() ? '' : 'text-white',
      ].join(' ');
    }

    switch (this.variant()) {
      case 'primary':
        base.push('bg-brand', 'text-white');
        break;
      case 'secondary':
        base.push('bg-[#F1F1F4]', 'text-[#4B5675]');
        break;
      case 'blue':
        base.push('bg-[#1B84FF]', 'text-white');
        break;
      case 'outline':
        base.push('bg-white', 'border-2', 'border-[#dbdfe96b]', 'text-[#2F3A4A]', 'border-w');
        break;
      case 'ghost':
        base.push('bg-transparent', 'text-[#2F3A4A]');
        break;
      case 'danger':
        base.push('bg-[#D92D20]', 'text-white');
        break;
      case 'black':
        base.push('bg-black', 'text-white');
        break;
      case 'white':
        base.push('bg-white', 'text-black');
        break;
    }

    base.push(this.buttonClass());
    return base.join(' ');
  }
}
