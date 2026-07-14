import { Component, computed, forwardRef, Input, input, signal } from '@angular/core';
import { FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { SafeHtml } from '@angular/platform-browser';
import { TranslatePipe } from '@ngx-translate/core';

type StrengthKey = 'weak' | 'fair' | 'good' | 'strong' | 'empty';
@Component({
  selector: 'app-tf-input',
  imports: [FormsModule, TranslatePipe],
  templateUrl: './tf-input.html',
  styleUrl: './tf-input.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TFInput),
      multi: true,
    },
  ],
})
export class TFInput {
  type = input<'text' | 'email' | 'password' | 'number'| 'date' | 'url' | 'checkbox' | 'textArea'>('text');
  label = input.required<string>();
  labelPosition = input<'start' | 'end'>('start');

  labelClass = input<string>();
  errorMessageClass = input<string>();
  inputClass = input<string>();

  placeholder = input<string | null>(null);
  errorMessage = input<string | string[] | null>(null);

  showLabel = input<boolean>(true);
  required = input<boolean>(false);
  isValid = input<boolean>(false);
  readonly = input<boolean>(false);
  @Input() disabled: boolean = false;
  showMeter = input<boolean>(false);

  icon = input<SafeHtml | null>(null);

  value = signal<any>(null);
  // Functions for ControlValueAccessor
  onChange: (_: any) => void = () => {};
  onTouched: () => void = () => {};

  writeValue(value: any): void {
    this.value.set(value);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onInputChange(event: any): void {
    this.value.set(event);
    if (this.type() == 'password' && this.showMeter()) {
      this.onPasswordInput(event);
    }
    this.onChange(this.value());
    this.onTouched();
  }

  onCheckboxChange(event: Event) {
    const checked = (event.target as HTMLInputElement).checked;

    this.onChange(checked);
  }

  generateId(text: string) {
    return text.replace(/\s+/g, '_').toLowerCase();
  }

  password = signal('');

  score = computed(() => {
    const val = this.password();
    let s = 0;
    if (!val) return 0;
    if (val.length >= 8) s++;
    if (/[A-Za-z]/.test(val)) s++;
    if (/[0-9]/.test(val)) s++;
    if (/[^A-Za-z0-9]/.test(val)) s++;

    return s;
  });

  strengthKey = computed<StrengthKey>(() => {
    const s = this.score();
    if (!this.password()) return 'empty';
    if (s <= 1) return 'weak';
    if (s === 2) return 'fair';
    if (s === 3) return 'good';
    return 'strong';
  });

  strengthLabel = computed(() => {
    switch (this.strengthKey()) {
      case 'weak':
        return 'Weak';
      case 'fair':
        return 'Fair';
      case 'good':
        return 'Good';
      case 'strong':
        return 'Strong';
      default:
        return 'Too short';
    }
  });

  displayMeter = computed(() => !!this.password());

  onPasswordInput(val: string) {
    this.password.set(val);
  }

  showPassword = signal(false);

  inputType = computed(() => (this.showPassword() ? 'text' : 'password'));

  toggleIcon = computed(() =>
    this.showPassword() ? 'fa-regular fa-eye-slash' : 'fa-regular fa-eye',
  );

  togglePassword(input: any) {
    this.showPassword.update((v) => !v);
    input.type = this.inputType();
  }
}
