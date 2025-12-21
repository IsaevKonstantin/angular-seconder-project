import { Component, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TuiIcon, TuiTextfield } from '@taiga-ui/core';
import { TUI_PASSWORD_TEXTS, TuiPassword } from '@taiga-ui/kit';
import { of } from 'rxjs';

@Component({
  selector: 'ui-input-password',
  imports: [TuiTextfield, ReactiveFormsModule, TuiIcon, TuiPassword],
  templateUrl: './ui-input-password.html',
  styleUrl: './ui-input-password.scss',
  providers: [
    {
      provide: TUI_PASSWORD_TEXTS,
      useValue: of(['Показать', 'Скрыть']),
    },
  ],
})
export class UiInputPassword {
  @Input() label = "";
  @Input() isCleaner = false;
  @Input() size: "s" | "m" | "l" = "m";
  @Input() placeholder = "";
  @Input({required: true}) inputPassControl!: FormControl<string | null>;
}
