import { Component, inject } from '@angular/core';
import { TuiDataList, TuiDropdown } from '@taiga-ui/core';
import { UiButton } from '../../../../shared/ui-components/ui-button/ui-button';
import { Router, RouterLink } from '@angular/router';
import { MainFacade } from '../../facade/main.facade';
import { TranslateModule } from '@ngx-translate/core';
import { UiDropdownMenu } from '../../../../shared/ui-components/ui-dropdown-menu/ui-dropdown-menu';
import { UiDropdownClose } from '../../../../shared/ui-directives/ui-dropdown-close.directive';

@Component({
  selector: 'ui-menu',
  imports: [TuiDropdown, TuiDataList, UiButton, UiDropdownMenu, UiDropdownClose, RouterLink, TranslateModule],
  templateUrl: './ui-menu.html',
  styleUrl: './ui-menu.scss',
})
export class UiMenu {
  private router = inject(Router);
  private mainFacade = inject(MainFacade);

  public items = this.mainFacade.MenuItems;
  public isOpen = false;
  public activeRoute: string | undefined;

  get CurrentRouteLabel(): string {
    const url = this.router.url.split("/");
    const route1 = url[url.length - 1];
    const route2 = url[url.length - 2];
    const allRoutes = this.mainFacade.AllPages.map(route => route.routerLink);
    this.activeRoute = allRoutes.includes(route1) ? route1 : route2;
    return this.mainFacade.AllPages.find(i => i.routerLink === this.activeRoute)?.label ?? '';
  }

  public closeMenu(): void {
    this.isOpen = false;
  }
}
