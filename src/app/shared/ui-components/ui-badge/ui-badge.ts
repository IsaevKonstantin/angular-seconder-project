import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TuiBadge } from '@taiga-ui/kit';

@Component({
  selector: 'ui-badge',
  imports: [TuiBadge, CommonModule],
  templateUrl: './ui-badge.html',
  styleUrl: './ui-badge.scss',
})
export class UiBadge {
  @Input() appearance!: "icon" | "outline" | "primary-destructive" | "primary-grayscale" |"primary" | "secondary-grayscale";
  @Input() statusColor: "online" | "offline" | null = null;
}
