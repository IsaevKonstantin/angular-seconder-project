import { Component, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TuiTextfield } from '@taiga-ui/core';
import { TuiTextarea } from '@taiga-ui/kit';

@Component({
  selector: 'ui-textarea',
  imports: [TuiTextfield, TuiTextarea, ReactiveFormsModule],
  templateUrl: './ui-textarea.html',
  styleUrl: './ui-textarea.scss',
})
export class UiTextarea {
  @Input() label = "";
  @Input() isCleaner = false;
  @Input() size: "s" | "m" | "l" = "m";
  @Input() placeholder = "";
  @Input({required: true}) textareaControl!: FormControl<string | null>;
}
