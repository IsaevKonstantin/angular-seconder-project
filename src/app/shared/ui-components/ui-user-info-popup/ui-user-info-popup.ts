import { Component, Input } from '@angular/core';
import { IContact } from '../../../domain/friendship.model';
import { IContactWS } from '../../../domain/contact.model';
import { IUser } from '../../../domain/user.model';
import { CommonModule } from '@angular/common';
import { TuiAvatar } from '@taiga-ui/kit';

@Component({
  selector: 'ui-user-info-popup',
  standalone: true,
  imports: [CommonModule, TuiAvatar],
  templateUrl: './ui-user-info-popup.html',
  styleUrl: './ui-user-info-popup.scss',
})
export class UiUserInfoPopup {
  @Input() contact!: IContact | IContactWS | IUser;
  @Input() messageCount: number = 0;
  @Input() isOnlineShow = false;

  get fullName(): string {
    if (!this.contact) return '';
    return [this.contact.lastName, this.contact.firstName, this.contact.patronymic].filter(Boolean).join(' ');
  }

  get onlineStatus(): boolean | null {
    if (!this.contact) return null;
    return 'online' in this.contact ? this.contact.online : null;
  }
}
