import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { WithdrawalOptionItemComponent } from '../withdrawal-option-item/withdrawal-option-item.component';

@Component({
  selector: 'app-withdrawal-option-list',
  templateUrl: './withdrawal-option-list.component.html',
  styleUrls: ['./withdrawal-option-list.component.scss'],
  standalone: true,
  imports: [CommonModule, WithdrawalOptionItemComponent],
})
export class WithdrawalOptionListComponent {
  @Input() withdrawalOptions: { coins: { [key: number]: number }; totalCoins: number }[] = [];
  readonly coinSizes = [11, 7, 5, 1];
}
