import { Component, Input } from '@angular/core';
import { TuiAvatar } from '@taiga-ui/kit';

@Component({
  selector: 'ui-avatar',
  imports: [TuiAvatar],
  templateUrl: './ui-avatar.html',
  styleUrl: './ui-avatar.scss',
})
export class UiAvatar {
  @Input() src!: string | null | undefined | ArrayBuffer;
  @Input() round = false;
  @Input() size: "s" | "m" | "xs" | "l" | "xl" | "xxl" = "m";
}
