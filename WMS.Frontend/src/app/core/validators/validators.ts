import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function integerValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const integerRegex = new RegExp('^\\d+$');
    const isValid = integerRegex.test(control.value);
    return isValid ? null : { integerValidator: true };
  };
}