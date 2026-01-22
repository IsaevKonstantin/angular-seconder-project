import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UiInput } from '../../../../shared/ui-components/ui-input/ui-input';
import { UiButton } from '../../../../shared/ui-components/ui-button/ui-button';
import { UiLanguageGroup } from '../../../../shared/ui-components/ui-language-group/ui-language-group';
import { TranslateModule } from '@ngx-translate/core';
import { UiInputPhone } from '../../../../shared/ui-components/ui-input-phone/ui-input-phone';
import { UiInputPassword } from '../../../../shared/ui-components/ui-input-password/ui-input-password'; 
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { AuthFacade } from '../../facade/auth.facade';
import { IRegisterRequest } from '../../../../infrastructure/auth/model/register-request.model';
import { catchError, EMPTY, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'register',
  imports: [ReactiveFormsModule, CommonModule, UiInput, UiInputPassword, UiInputPhone, UiButton, UiLanguageGroup, TranslateModule],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register implements OnInit{
  private authFacade = inject(AuthFacade);
  private readonly destroyRef = inject(DestroyRef);
  
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
    patronymic: new FormControl<string | null>(null, {validators: [Validators.required]}),
    phone: new FormControl<string | null>(null, {validators: [Validators.required, this.phoneNumberMinLenValidator]}),
    email: new FormControl<string | null>(null, {validators: [Validators.required]}),
  });

  ngOnInit(): void {
    this.formSub();
  }

  private formSub(): void {
    this.form.valueChanges.pipe(
      takeUntilDestroyed(this.destroyRef),
      tap(() => {
        const { login, password } = this.form.controls;
        if (login.hasError('authErr')) {
          login.hasError('required') ? delete login.errors!['authErr'] : login.setErrors(null);
        }
        if (password.hasError('authErr')) {
          password.hasError('required') ? delete password.errors!['authErr'] : password.setErrors(null);
        }
      }),
    ).subscribe();
  }

  public register(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }
    this.authFacade.register(this.form.getRawValue() as IRegisterRequest).pipe(
      takeUntilDestroyed(this.destroyRef),
      catchError(err => {
        console.log(err);
        this.form.controls.login.setErrors({authErr: true});
        this.form.controls.password.setErrors({authErr: true});
        return EMPTY;
      }),
    ).subscribe();
  }

  public goSignIn(): void {
    this.authFacade.navigate('login');
  }
}
