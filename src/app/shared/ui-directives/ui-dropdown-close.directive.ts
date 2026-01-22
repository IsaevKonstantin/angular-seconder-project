import { Directive, Host, HostListener } from "@angular/core";
import { UiDropdownMenu } from "../ui-components/ui-dropdown-menu/ui-dropdown-menu";

@Directive({
  selector: '[uiDropdownClose]',
})
export class UiDropdownClose {
  constructor(@Host() private menu: UiDropdownMenu) {}

  @HostListener('click')
  close() {
    this.menu.close();
  }
}