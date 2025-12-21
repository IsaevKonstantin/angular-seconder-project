import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TuiAppearance, TuiButton } from '@taiga-ui/core';
import { TuiButtonLoading } from '@taiga-ui/kit';

@Component({
  selector: 'ui-button',
  imports: [TuiButton, TuiButtonLoading],
  templateUrl: './ui-button.html',
  styleUrl: './ui-button.scss',
})
export class UiButton {
  @Input() text!: string;
  @Input() size: "s" | "m" | "l" | "xl" | "xs" = "m";
  @Input() type: "button" | "submit" = "button"
  @Input() isLoading = false;
  @Input() isDisabled = false;
  @Input() iconStart = "";
  @Input() iconEnd = "";
  @Input() appearance: "accent" | "action-destructive" | "action-grayscale" | "action" | "flat-destructive" | "flat-grayscale" | "flat" | "floating" | "glass" | "icon" | "info" | "negative" | "neutral" | "outline-destructive" | "outline-grayscale" | "outline" | "positive" | "primary-destructive" | "primary-grayscale" | "primary" | "secondary-destructive" | "secondary-grayscale" | "secondary" | "textfield" | "warning" = "primary";
  
  @Output() outClickEmitter = new EventEmitter<Event>();

  public clickEmitter(event: Event) {
    event.stopPropagation();
    this.outClickEmitter.emit(event);
  }
}
