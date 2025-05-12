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
import { CoinCombination } from '../../interfaces/coin.interface';
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

  public paymentForm: FormGroup;
  public change = 0;
  public total!: number;
  public withdrawalOptions: CoinCombination[] = [];

  constructor(
    private ordersFacade: OrdersFacade,
    private fb: FormBuilder,
    private coinService: CoinService,
  ) {
    this.paymentForm = this.fb.group({
      receivedMoney: [
        null,
        [
          Validators.required,
          Validators.min(0),
          this.wholeNumberValidator(),
          this.maxDigitsValidator(16),
        ],
      ],
    });
  }

  public ngOnInit() {
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

  public ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public onInputDigitsLimit(event: Event) {
    const input = event.target as HTMLInputElement;
    const digits = input.value.replace(/\D/g, ''); // Get only digits
    if (digits.length > 16) {
      input.value = digits.slice(0, 16); // Truncate extra digits
      this.receivedMoneyControl.setValue(Number(input.value)); // Update form control
    }
  }

  public calculateChange() {
    if (this.paymentForm.valid) {
      const received = Number(this.receivedMoneyControl.value);
      this.change = received - this.total;

      if (this.change > 0) {
        this.withdrawalOptions = this.coinService.getAllWithdrawalOptions(this.change);
      } else {
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

  private maxDigitsValidator(maxDigits: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (value == null) return null;
      const digits = value.toString().replace(/[^0-9]/g, '').length;
      return digits > maxDigits ? { maxDigits: true } : null;
    };
  }

  public get receivedMoneyControl() {
    return this.paymentForm.get('receivedMoney') as FormControl;
  }

  public trackByFn(index: number, option: CoinCombination) {
    return option.amount;
  }
}
