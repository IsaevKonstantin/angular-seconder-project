import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UiInput } from '../../../../shared/ui/ui-input/ui-input';
import { UiButton } from '../../../../shared/ui/ui-button/ui-button';
import { UiLanguageGroup } from '../../../../shared/ui/ui-language-group/ui-language-group';
import { TranslateModule } from '@ngx-translate/core';
import { UiInputPhone } from '../../../../shared/ui/ui-input-phone/ui-input-phone';
import { UiInputPassword } from '../../../../shared/ui/ui-input-password/ui-input-password';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

@Component({
  selector: 'register',
  imports: [ReactiveFormsModule, CommonModule, UiInput, UiInputPassword, UiInputPhone, UiButton, UiLanguageGroup, TranslateModule],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  private router = inject(Router);
  private passwordValidator: ValidatorFn = (
    control: AbstractControl<string | null>
  ): ValidationErrors | null => {
    const value = control.value;
    if (!value) return null;

    const errors: ValidationErrors = {};
    if (/\s/.test(value)) errors['whitespace'] = true;
    if (/[а-яА-ЯёЁ]/.test(value)) errors['cyrillic'] = true;
    if (!/^[A-Za-z\d\W_]+$/.test(value)) errors['invalidCharacters'] = true;
    if (!/[A-Z]/.test(value)) errors['uppercase'] = true;
    if (!/[a-z]/.test(value)) errors['lowercase'] = true;
    if (!/\d/.test(value)) errors['digit'] = true;
    if (!/[^\w\s]/.test(value)) errors['specialCharacter'] = true;
    if (value.length < 6) {
      errors['minLength'] = {
        requiredLength: 6,
        actualLength: value.length,
      };
    }
    return Object.keys(errors).length ? errors : null;
  };
  private phoneNumberMinLenValidator: ValidatorFn = (
    control: AbstractControl<string | null>
  ): ValidationErrors | null => {
    const value = control.value;
    if (!value) return null;
    if (value.length < 12) return {minLength: true};
    return null;
  };

  protected form = new FormGroup({
    login: new FormControl<string | null>(null, {validators: [Validators.required]}),
    password: new FormControl<string | null>(null, {validators: [Validators.required, this.passwordValidator]}),
    lastName: new FormControl<string | null>(null, {validators: [Validators.required]}),
    firstName: new FormControl<string | null>(null, {validators: [Validators.required]}),
    patronymic: new FormControl<string | null>(null),
    phone: new FormControl<string | null>(null, {validators: [Validators.required, this.phoneNumberMinLenValidator]}),
    email: new FormControl<string | null>(null, {validators: [Validators.required]}),
  });

  public register(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { login, password, lastName, firstName, patronymic, phone, email } = this.form.getRawValue();
    console.log(login, password, lastName, firstName, patronymic, phone, email);
    this.router.navigate(['/main']);
  }

  public goSignIn(): void {
    this.router.navigate(['/login']);
  }
}
