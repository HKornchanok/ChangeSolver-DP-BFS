import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { Shoe } from '../../../interfaces/item.interface';
import { Order } from '../../../interfaces/orders.interfaces';
import { OrdersFacade } from '../../../store/orders/orders.facade';

@Component({
  selector: 'app-shoe-item',
  templateUrl: './shoe-item.component.html',
  styleUrls: ['./shoe-item.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class ShoeItemComponent implements OnInit, OnDestroy {
  @Input() shoe!: Shoe;
  @Output() cartChange = new EventEmitter<Order>();

  amount: number = 0;
  private destroy$ = new Subject<void>();

  constructor(private readonly ordersFacade: OrdersFacade) {}

  ngOnInit() {
    // Subscribe to orders changes
    this.ordersFacade.orders$.pipe(takeUntil(this.destroy$)).subscribe(orders => {
      const order = orders.find(o => o.id === this.shoe.id);
      if (order) {
        this.amount = order.quantity;
      } else {
        this.amount = 0;
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  addToCart() {
    this.amount = 1;
    this.cartChange.emit({
      id: this.shoe.id,
      name: this.shoe.name,
      price: this.shoe.price,
      description: this.shoe.description,
      quantity: this.amount,
    });
  }

  increaseAmount() {
    this.amount++;
    this.cartChange.emit({
      id: this.shoe.id,
      name: this.shoe.name,
      price: this.shoe.price,
      description: this.shoe.description,
      quantity: this.amount,
    });
  }

  decreaseAmount() {
    if (this.amount > 0) {
      this.amount--;
      this.cartChange.emit({
        id: this.shoe.id,
        name: this.shoe.name,
        price: this.shoe.price,
        description: this.shoe.description,
        quantity: this.amount,
      });
    }
  }
}
