import { Component, effect, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TuiGroup } from '@taiga-ui/core';
import { TuiBlock } from '@taiga-ui/kit';

@Component({
  selector: 'ui-language-group',
  imports: [ReactiveFormsModule, TuiBlock, TuiGroup, TranslateModule],
  templateUrl: './ui-language-group.html',
  styleUrl: './ui-language-group.scss',
})
export class UiLanguageGroup {
  private translate = inject(TranslateService);
  private savedLang = localStorage.getItem('lang') || 'ru';

  protected languageForm = new FormGroup({
    languageValue: new FormControl(this.savedLang),
  })
  protected language = toSignal(this.languageForm.valueChanges, {
    initialValue: this.languageForm.value
  });

  constructor() {
    effect(() => {
      const current = this.language().languageValue;
      if (!current) return;

      this.translate.use(current);
      localStorage.setItem('lang', current);
    });
  }
}
