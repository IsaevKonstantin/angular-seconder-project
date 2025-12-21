import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UiInput } from '../../../../shared/ui/ui-input/ui-input';
import { UiButton } from '../../../../shared/ui/ui-button/ui-button';
import { UiLanguageGroup } from '../../../../shared/ui/ui-language-group/ui-language-group';
import { TranslateModule } from '@ngx-translate/core';
import { UiInputPassword } from '../../../../shared/ui/ui-input-password/ui-input-password';


@Component({
  selector: 'login',
  imports: [ReactiveFormsModule, UiInput, UiInputPassword, UiButton, UiLanguageGroup, TranslateModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private router = inject(Router);
  protected form = new FormGroup({
    login: new FormControl<string | null>(null, {validators: [Validators.required]}),
    password: new FormControl<string | null>(null, {validators: [Validators.required]}),
  });

  public signIn(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { login, password } = this.form.getRawValue();
    console.log(login, password);
    this.router.navigate(['/main']);
  }

  public goRegister(): void {
    this.router.navigate(['/register']);
  }
}
