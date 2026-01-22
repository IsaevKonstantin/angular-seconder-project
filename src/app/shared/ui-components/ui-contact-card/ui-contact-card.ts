import { Component, Input } from '@angular/core';
import { UiAvatar } from '../ui-avatar/ui-avatar';
import { CommonModule } from '@angular/common';
import { IContactWS } from '../../../domain/contact.model';
import { TuiFade } from '@taiga-ui/kit';
import { TranslateModule } from '@ngx-translate/core';
import { UiBadge } from '../ui-badge/ui-badge';

@Component({
  selector: 'ui-contact-card',
  imports: [UiAvatar, UiBadge, TuiFade, TranslateModule, CommonModule],
  templateUrl: './ui-contact-card.html',
  styleUrl: './ui-contact-card.scss',
})
export class UiContactCard {
  @Input() contact!: IContactWS;
  @Input() messageCount: number = 0;
  @Input() size: 's' | 'm' = 's';
  @Input() isFio = false;
  @Input() isLogin = false;
  @Input() backgroundColor: "light_gray" | "dark_gray" | null = null;
  @Input() isActions = false;
  @Input() isOnlineShow = false;
  @Input() isBadge: boolean = false;

  get ContactFLP(): string {
    if (!this.contact) return "";
    return [this.contact.lastName, this.contact.firstName, this.contact.patronymic].join(" ");
  }

  get IsWithStatus(): boolean | null {
    if ("online" in this.contact) return this.contact.online;
    return null;
  }
}
