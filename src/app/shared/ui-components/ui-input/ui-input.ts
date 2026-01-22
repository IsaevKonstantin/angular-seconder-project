import { Component, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TuiTextfield } from '@taiga-ui/core';

@Component({
  selector: 'ui-input',
  imports: [TuiTextfield, ReactiveFormsModule],
  templateUrl: './ui-input.html',
  styleUrl: './ui-input.scss',
})
export class UiInput {
  @Input() label = "";
  @Input() isCleaner = false;
  @Input() size: "s" | "m" | "l" = "m";
  @Input() placeholder = "";
  @Input() type = "text";
  @Input() icon = "";
  @Input() autocomplete: "on" | "off" = "off";
  @Input({required: true}) inputControl!: FormControl<string | null>;
}
