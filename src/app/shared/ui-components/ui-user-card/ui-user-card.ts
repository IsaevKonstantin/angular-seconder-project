import { Component, Input } from "@angular/core";
import { IUser } from "../../../domain/user.model";
import { UiAvatar } from "../ui-avatar/ui-avatar";
import { TranslateModule } from "@ngx-translate/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: 'ui-user-card',
  imports: [UiAvatar, TranslateModule, CommonModule],
  templateUrl: './ui-user-card.html',
  styleUrl: './ui-user-card.scss',
})
export class UiUserCard {
  @Input() user!: IUser;
  @Input() size: 's' | 'm' = 's';

  get UserFLP(): string {
    if (!this.user) return "";
    return [this.user.lastName, this.user.firstName, this.user.patronymic].join(" ");
  }
}