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

@Component({
  selector: 'register',
  imports: [ReactiveFormsModule, CommonModule, UiInput, UiInputPassword, UiInputPhone, UiButton, UiLanguageGroup, TranslateModule],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  private router = inject(Router);
  protected form = new FormGroup({
    login: new FormControl<string | null>(null, {validators: [Validators.required]}),
    password: new FormControl<string | null>(null, {validators: [Validators.required]}),
    lastName: new FormControl<string | null>(null, {validators: [Validators.required]}),
    firstName: new FormControl<string | null>(null, {validators: [Validators.required]}),
    patronymic: new FormControl<string | null>(null),
    phone: new FormControl<string | null>(null, {validators: [Validators.required]}),
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
