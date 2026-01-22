import { Component, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TuiTextfield } from '@taiga-ui/core';
import { TuiInputPhone } from '@taiga-ui/kit';

@Component({
  selector: 'ui-input-phone',
  imports: [TuiInputPhone, TuiTextfield, ReactiveFormsModule],
  templateUrl: './ui-input-phone.html',
  styleUrl: './ui-input-phone.scss',
})
export class UiInputPhone {
  @Input() label = "";
  @Input() isCleaner = false;
  @Input() size: "s" | "m" | "l" = "m";
  @Input() placeholder = "";
  @Input({required: true}) inputControl!: FormControl<string | null>;
}
