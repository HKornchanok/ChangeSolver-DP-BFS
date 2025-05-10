import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { CoinService } from '../../services/coin.service';
import { OrdersFacade } from '../../store/orders/orders.facade';
import { WithdrawalOptionListComponent } from './withdrawal-option-list/withdrawal-option-list.component';

@Component({
  selector: 'app-payment-summary',
  templateUrl: './payment-summary.component.html',
  styleUrls: ['./payment-summary.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, WithdrawalOptionListComponent],
})
export class PaymentSummaryComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private readonly COIN_SIZES = [11, 7, 5, 1];

  public paymentForm: FormGroup;
  public change = 0;
  public total!: number;
  public coinCombination = '';
  public withdrawalOptions: { coins: { [key: number]: number }; totalCoins: number }[] = [];

  constructor(
    private ordersFacade: OrdersFacade,
    private fb: FormBuilder,
    private coinService: CoinService,
  ) {
    this.paymentForm = this.fb.group({
      receivedMoney: [null, [Validators.required, Validators.min(0), this.wholeNumberValidator()]],
    });
  }

  ngOnInit() {
    this.ordersFacade.total$.pipe(takeUntil(this.destroy$)).subscribe(total => {
      this.total = total;
      const ctrl = this.paymentForm.get('receivedMoney');
      if (ctrl) {
        ctrl.setValidators([
          Validators.required,
          Validators.min(this.total),
          this.wholeNumberValidator(),
        ]);
        ctrl.updateValueAndValidity();
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  calculateChange() {
    if (this.paymentForm.valid) {
      const received = Number(this.receivedMoneyControl.value);
      this.change = received - this.total;

      if (this.change > 0) {
        const combination = this.coinService.calculateOptimalCoinCombination(this.change);
        this.coinCombination = this.coinService.formatCoinCombination(combination);
        this.withdrawalOptions = this.coinService.getAllWithdrawalOptions(this.change);
      } else {
        this.coinCombination = '';
        this.withdrawalOptions = [];
      }
    }
  }
  private wholeNumberValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      return value != null && !Number.isInteger(+value) ? { notWholeNumber: true } : null;
    };
  }

  get receivedMoneyControl() {
    return this.paymentForm.get('receivedMoney') as FormControl;
  }

  public trackByFn(
    index: number,
    option: { coins: { [key: number]: number }; totalCoins: number },
  ) {
    return option.totalCoins;
  }
}
