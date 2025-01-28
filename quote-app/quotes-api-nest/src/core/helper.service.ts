import { ValidationError } from 'class-validator';

export function checkValidationErrorMessage(errors: ValidationError[]): string {
  return JSON.stringify(errors);
}
