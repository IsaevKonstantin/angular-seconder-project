import { Component } from '@angular/core';
import { TuiScrollbar } from '@taiga-ui/core';

@Component({
  selector: 'ui-scrollbar',
  imports: [TuiScrollbar],
  template: `
    <tui-scrollbar>
      <ng-content></ng-content>
    </tui-scrollbar>`,
})
export class UiScrollbar {}

