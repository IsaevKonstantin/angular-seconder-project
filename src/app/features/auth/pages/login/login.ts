import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UiInput } from '../../../../shared/ui-components/ui-input/ui-input';
import { UiButton } from '../../../../shared/ui-components/ui-button/ui-button';
import { UiLanguageGroup } from '../../../../shared/ui-components/ui-language-group/ui-language-group';
import { TranslateModule } from '@ngx-translate/core';
import { UiInputPassword } from '../../../../shared/ui-components/ui-input-password/ui-input-password';
import { AuthFacade } from '../../facade/auth.facade';
import { ILoginRequest } from '../../../../infrastructure/auth/model/login-request.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, EMPTY, tap } from 'rxjs';

@Component({
  selector: 'login',
  imports: [ReactiveFormsModule, UiInput, UiInputPassword, UiButton, UiLanguageGroup, TranslateModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login implements OnInit {
  private authFacade = inject(AuthFacade);
  private readonly destroyRef = inject(DestroyRef);
  
  protected form = new FormGroup({
    login: new FormControl<string | null>(null, {validators: [Validators.required]}),
    password: new FormControl<string | null>(null, {validators: [Validators.required]}),
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

  public signIn(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }
    this.authFacade.login(this.form.getRawValue() as ILoginRequest).pipe(
      takeUntilDestroyed(this.destroyRef),
      catchError(err => {
        console.log(err);
        this.form.controls.login.setErrors({authErr: true});
        this.form.controls.password.setErrors({authErr: true});
        return EMPTY;
      }),
    ).subscribe();
  }

  public goRegister(): void {
    this.authFacade.navigate('register');
  }
}
