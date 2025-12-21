import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { UiButton } from '../../../../shared/ui/ui-button/ui-button';


@Component({
  selector: 'not-found',
  imports: [UiButton, TranslateModule],
  templateUrl: './not-found.html',
  styleUrl: './not-found.scss',
})
export class NotFound implements OnInit {
  private router = inject(Router);
  private translate = inject(TranslateService);

  ngOnInit() {
    this.translate.use(localStorage.getItem('lang') || 'ru');
  } 

  public goHomePage(): void {
    this.router.navigate(['/']);
  }
}
