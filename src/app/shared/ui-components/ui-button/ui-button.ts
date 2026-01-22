import { Component, Input } from '@angular/core';
import { TuiButton } from '@taiga-ui/core';
import { TuiButtonLoading } from '@taiga-ui/kit';

@Component({
  selector: 'ui-button',
  imports: [TuiButton, TuiButtonLoading],
  templateUrl: './ui-button.html',
  styleUrl: './ui-button.scss',
})
export class UiButton {
  @Input() size: "s" | "m" | "l" | "xl" | "xs" = "m";
  @Input() isLoading = false;
  @Input() isDisabled = false;
  @Input() iconStart = "";
  @Input() iconEnd = "";
  @Input() appearance: "icon" | "outline" | "primary-destructive" | "primary-grayscale" |"primary" | "secondary-grayscale" = "primary";
  @Input() apperanceMode: string | null = null;
}
