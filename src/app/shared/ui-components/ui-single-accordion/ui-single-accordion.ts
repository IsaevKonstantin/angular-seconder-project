import { Component, Input } from '@angular/core';
import { TuiAccordion } from '@taiga-ui/experimental';

@Component({
  selector: 'ui-single-accordion',
  imports: [TuiAccordion],
  templateUrl: './ui-single-accordion.html',
})
export class UiSingleAccordion {
  @Input() title = "";
  @Input() size: 's' | 'm' | 'l' = 'm';
  @Input() isOpen = false;
}
