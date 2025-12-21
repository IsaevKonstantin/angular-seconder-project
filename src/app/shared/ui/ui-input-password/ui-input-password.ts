import { Component, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { TUI_HINT_OPTIONS, TuiHintOptions, TuiIcon, TuiTextfield } from '@taiga-ui/core';
import { TUI_PASSWORD_TEXTS, TuiPassword } from '@taiga-ui/kit';
import { map, of } from 'rxjs';

@Component({
  selector: 'ui-input-password',
  imports: [TuiTextfield, ReactiveFormsModule, TuiIcon, TuiPassword],
  templateUrl: './ui-input-password.html',
  styleUrl: './ui-input-password.scss',
  providers: [
    {
      provide: TUI_PASSWORD_TEXTS,
      useFactory: (translate: TranslateService) =>
        translate.stream('PASSWOR_INPUT').pipe(
          map(translations => ([translations.SHOW_TEXT, translations.HIDE_TEXT]))
        ),
      deps: [TranslateService],
    },
    {
      provide: TUI_HINT_OPTIONS,
      useValue: <Partial<TuiHintOptions>>{
        direction: 'top-left'
      }
    }
  ],
})
export class UiInputPassword {
  @Input() label = "";
  @Input() isCleaner = false;
  @Input() size: "s" | "m" | "l" = "m";
  @Input() placeholder = "";
  @Input({required: true}) inputPassControl!: FormControl<string | null>;
}
