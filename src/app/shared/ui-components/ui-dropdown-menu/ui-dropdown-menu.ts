import { Component, Input } from '@angular/core';
import { TuiDropdown, TuiDataList, TuiVerticalDirection, TuiHorizontalDirection, TuiDropdownWidth } from '@taiga-ui/core';
import { UiButton } from '../ui-button/ui-button';

@Component({
  selector: 'ui-dropdown-menu',
  imports: [TuiDropdown, TuiDataList, UiButton],
  templateUrl: './ui-dropdown-menu.html',
  styleUrl: './ui-dropdown-menu.scss',
})
export class UiDropdownMenu {
  @Input() offset = 15;
  @Input() verticalDirection: TuiVerticalDirection = 'bottom';
  @Input() horizontalDirection: TuiHorizontalDirection = 'left';
  @Input() width: TuiDropdownWidth = 'auto';
  @Input() sided = false;
  @Input() appearance: "icon" | "outline" | "primary-destructive" | "primary-grayscale" |"primary" | "secondary-grayscale" = "primary";

  public isOpen = false;

  public close(): void {
    this.isOpen = false;
  }
}
