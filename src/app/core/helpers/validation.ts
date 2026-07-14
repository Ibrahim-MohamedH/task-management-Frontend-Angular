import { inject, Injectable } from '@angular/core';
import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
type ErrorMessageFactory = string | ((error: any, field: string) => string);

@Injectable({
  providedIn: 'root',
})
export class Validation {
  private translate = inject(TranslateService);

  // رسالة افتراضية
  private static readonly UNKNOWN_ERROR = 'Invalid field';

  // جميع الرسائل
  private readonly errorMessages: Record<string, ErrorMessageFactory> = {
    required: (_: any, field: string) => `${field} is required`,

    minlength: (error, field) =>
      `${field} must be at least ${error.requiredLength} characters long`,

    maxlength: (error, field) => `${field} cannot exceed ${error.requiredLength} characters`,

    min: (error, field) => `Minimum value for ${field} is ${error.min}`,

    max: (error, field) => `Maximum value for ${field} is ${error.max}`,

    pattern: (_: any, field: string) => `${field} format is invalid`,

    validNumber: (_: any, field: string) => `${field} must be a valid number`,

    nonEmptyString: (_: any, field: string) => `${field} cannot be empty`,

    email: 'Invalid email format',

    matchPassword: 'Passwords do not match',

    customError: (error) => error,
  };

  getErrorMessage(
    form: FormGroup,
    controlName: string,
    fieldName?: string,
    apiErrors?: Record<string, any>,
  ): string[] | null {
    const control = form.get(controlName);

    if (!control) return null;

    const fieldError = controlName.split('.').pop()!;
    if (apiErrors?.[fieldError]) {
      control.markAsTouched();
    }

    const formattedControlName = fieldName ?? this.convertCamelCaseToNormalText(controlName);

    const field = this.translate.instant(formattedControlName);

    const hasApiError = !!apiErrors?.[fieldError];

    const shouldShowError = hasApiError || (control.invalid && (control.touched || control.dirty));

    if (!shouldShowError || !control.errors) {
      return null;
    }

    const errors = control.errors;

    return Object.keys(errors).map((error) => {
      switch (error) {
        case 'required':
          return this.translate.instant('errors.required', { field });

        case 'minlength': {
          const minlengthError = errors[error] as { requiredLength: number };
          return this.translate.instant('errors.minlength', {
            field,
            requiredLength: minlengthError.requiredLength,
          });
        }

        case 'maxlength': {
          const maxlengthError = errors[error] as { requiredLength: number };
          return this.translate.instant('errors.maxlength', {
            field,
            requiredLength: maxlengthError.requiredLength,
          });
        }

        case 'min': {
          const minError = errors[error] as { min: number };
          return this.translate.instant('errors.min', {
            field,
            min: minError.min,
          });
        }

        case 'max': {
          const maxError = errors[error] as { max: number };
          return this.translate.instant('errors.max', {
            field,
            max: maxError.max,
          });
        }

        case 'pattern':
          return this.translate.instant('errors.pattern', { field });

        case 'arabicLetters':
          return this.translate.instant('errors.arabicLetters', { field });

        case 'validNumber':
          return this.translate.instant('errors.validNumber', { field });

        case 'nonEmptyString':
          return this.translate.instant('errors.nonEmptyString', { field });

        case 'email':
          return this.translate.instant('errors.email');

        case 'endDateBeforeStartDate':
          return this.translate.instant('errors.endDateBeforeStartDate');

        case 'matchPassword':
        case 'mismatch':
          return this.translate.instant('errors.passwordMismatch');

        case 'customError':
          return this.translate.instant(errors[error] as string);

        case 'tooMany':
          return this.translate.instant('errors.fileTooMany', { field });

        case 'invalidFiles':
          return this.translate.instant('errors.invalidFileTypeOrSize', {
            field,
          });

        case 'processingFailed':
          return this.translate.instant('errors.fileProcessingFailed', {
            field,
          });

        default:
          return this.translate.instant('errors.unknown');
      }
    });
  }

  convertCamelCaseToNormalText(camelCase: string): string {
    if (!camelCase) return camelCase;

    // Remove text before a period
    const noPrefix = camelCase.includes('.')
      ? camelCase.split('.').pop()!.trim()
      : camelCase.trim();
    // Convert camelCase to normal text
    const result = noPrefix.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());
    // Remove _ from text
    return result.replaceAll('_', ' ').trim();
  }

  customErrorValidator(errorMessage: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      return control.value ? null : { customError: errorMessage };
    };
  }

  private formatControlName(value: string): string {
    if (!value) return value;

    const cleanValue = value.includes('.') ? value.split('.').pop()! : value;

    return cleanValue.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());
  }

  isValid(form: FormGroup, controlName: string): boolean {
    const control = form.get(controlName);

    return !!(control && control.valid && (control.touched || control.dirty));
  }

  isInvalid(form: FormGroup, controlName: string, apiErrors?: Record<string, any>): boolean {
    const control = form.get(controlName);

    if (!control) return false;

    const field = controlName.split('.').pop()!;

    return !!(apiErrors?.[field] || (control.invalid && (control.touched || control.dirty)));
  }
}
