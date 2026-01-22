import { Component, Input } from '@angular/core';
import { IContactWS } from '../../../domain/contact.model';
import { UiAvatar } from '../ui-avatar/ui-avatar';
import { UiBadge } from '../ui-badge/ui-badge';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'ui-contact-info-card',
  imports: [UiAvatar, UiBadge, TranslateModule],
  templateUrl: './ui-contact-info-card.html',
  styleUrl: './ui-contact-info-card.scss',
})
export class UiContactInfoCard {
  @Input() contact!: IContactWS;
}
