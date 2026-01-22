import { Component, effect, inject, OnDestroy, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MainFacade } from '../../facade/main.facade';
import { UiMenu } from '../ui-menu/ui-menu';
import { UiButton } from '../../../../shared/ui-components/ui-button/ui-button';
import { TranslateModule, TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'main',
  imports: [RouterOutlet, UiMenu, UiButton, RouterLink, TranslateModule],
  templateUrl: './main.html',
  styleUrl: './main.scss',
})
export class Main implements OnInit, OnDestroy {
  private mainFacade = inject(MainFacade);
  private translate = inject(TranslateService);
  private currentLang = localStorage.getItem('lang') || 'ru';

  constructor() {
    effect(() => {
      this.translate.use(this.currentLang);
      localStorage.setItem('lang', this.currentLang);
    });
  }

  ngOnInit(): void {
    this.mainFacade.connect();
  }

  ngOnDestroy(): void {
    this.mainFacade.disconnect();
  }

  public logOut(): void {
    this.mainFacade.logOut();
  }
}