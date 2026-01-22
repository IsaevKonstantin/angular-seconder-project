import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { UiLanguageGroup } from '../../../../shared/ui-components/ui-language-group/ui-language-group';
import { UiButton } from '../../../../shared/ui-components/ui-button/ui-button';
import { UiInput } from '../../../../shared/ui-components/ui-input/ui-input';
import { UiTextarea } from '../../../../shared/ui-components/ui-textarea/ui-textarea';
import { UiInputPhone } from '../../../../shared/ui-components/ui-input-phone/ui-input-phone';
import { UiAvatar } from "../../../../shared/ui-components/ui-avatar/ui-avatar";
import { UiInputPassword } from '../../../../shared/ui-components/ui-input-password/ui-input-password';
import { SettingsFacade } from '../../facade/settings.facade';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { IUpdateUserDataRequest } from '../../../../infrastructure/user/model/update-user-data.model';

@Component({
  selector: 'settings',
  imports: [ReactiveFormsModule, UiInput, UiInputPassword, UiInputPhone, UiButton, UiTextarea, UiLanguageGroup, UiAvatar, TranslateModule],
  templateUrl: './settings.html',
  styleUrl: './settings.scss',
})
export class Settings implements OnInit {
  private settingsFacade = inject(SettingsFacade);
  private readonly destroyRef = inject(DestroyRef);

  private user = this.settingsFacade.user;
  private passwordValidator: ValidatorFn = (
    control: AbstractControl<string | null>
  ): ValidationErrors | null => {
    const curValue = this.form?.controls.currentPassword.value;
    if (!curValue) return null;
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
    login: new FormControl<string>("", {nonNullable: true, validators: [Validators.required]}),
    currentPassword: new FormControl<string | null>(null),
    newPassword: new FormControl<string | null>(null, {validators: [this.passwordValidator]}),
    lastName: new FormControl<string>("", {nonNullable: true, validators: [Validators.required]}),
    firstName: new FormControl<string>("", {nonNullable: true, validators: [Validators.required]}),
    patronymic: new FormControl<string>("", {nonNullable: true, validators: [Validators.required]}),
    phone: new FormControl<string>("", {nonNullable: true, validators: [Validators.required, this.phoneNumberMinLenValidator]}),
    email: new FormControl<string>("", {nonNullable: true, validators: [Validators.required]}),
    about: new FormControl<string | null>(null),
    avatar: new FormControl<string | ArrayBuffer | null>(null),
  });

  ngOnInit(): void {
    this.form.patchValue({
      login: this.user().login,
      lastName: this.user().lastName,
      firstName: this.user().firstName,
      patronymic: this.user().patronymic,
      phone: this.user().phone,
      email: this.user().email,
      about: this.user().about ?? null,
      avatar: this.user().avatarBase64 ?? null,
    })
  }

  public changeLanguage(lang: 'ru' | 'en'): void {
    this.settingsFacade.changeLanguage(lang);
  }

  public uploadAvatar(event: Event): void {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      this.form.controls.avatar.setValue(reader.result);
      this.form.controls.avatar.markAsDirty();
    }
    reader.readAsDataURL(file);
  }

  public deleteAvatar(): void {
    this.form.controls.avatar.setValue(null);
    this.form.controls.avatar.markAsDirty();
  }

  public saveSettings(): void {
    
    const req: IUpdateUserDataRequest = {
      id: this.user().id,
      login: this.form.controls.login.value,
      firstName: this.form.controls.firstName.value,
      lastName: this.form.controls.lastName.value,
      patronymic: this.form.controls.patronymic.value,
      phone: this.form.controls.phone.value,
      email: this.form.controls.email.value,
      about: this.form.controls.about.value,
      avatarBase64: this.form.controls.avatar.value ? String(this.form.controls.avatar.value).split(',')[1] : null,
      currentPassword: this.form.controls.currentPassword.value,
      newPassword: this.form.controls.newPassword.value,
    }
    this.settingsFacade.updateUserData(req).pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe(() => {
      this.form.controls.newPassword.setValue(null);
      this.form.controls.currentPassword.setValue(null);
      this.form.markAsPristine();
    });
  }

  public logOut(): void {
    this.settingsFacade.logOut();
  }
}
