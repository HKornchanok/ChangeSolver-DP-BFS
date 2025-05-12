import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { CoinCombination } from '../../../interfaces/coin.interface';
import { WithdrawalOptionItemComponent } from '../withdrawal-option-item/withdrawal-option-item.component';

@Component({
  selector: 'app-withdrawal-option-list',
  templateUrl: './withdrawal-option-list.component.html',
  styleUrls: ['./withdrawal-option-list.component.scss'],
  standalone: true,
  imports: [CommonModule, WithdrawalOptionItemComponent],
})
export class WithdrawalOptionListComponent {
  @Input() withdrawalOptions: CoinCombination[] = [];
  readonly coinSizes = [11, 7, 5, 1];
}
