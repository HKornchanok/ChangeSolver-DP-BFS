import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-withdrawal-option-item',
  templateUrl: './withdrawal-option-item.component.html',
  styleUrls: ['./withdrawal-option-item.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class WithdrawalOptionItemComponent {
  @Input() coinSize!: number;
  @Input() count!: number;
}
