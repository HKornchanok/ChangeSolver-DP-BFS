import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { Order } from '../../interfaces/orders.interfaces';
import { OrdersFacade } from '../../store/orders/orders.facade';
import { OrderItemComponent } from './order-item/order-item.component';

@Component({
  selector: 'app-order-summary',
  templateUrl: './order-summary.component.html',
  styleUrls: ['./order-summary.component.scss'],
  standalone: true,
  imports: [CommonModule, OrderItemComponent],
})
export class OrderSummaryComponent implements OnInit, OnDestroy {
  public orders: Order[] = [];
  private destroy$ = new Subject<void>();
  public total: number = 0;

  constructor(private readonly ordersFacade: OrdersFacade) {}

  ngOnInit() {
    this.ordersFacade.orders$.pipe(takeUntil(this.destroy$)).subscribe(orders => {
      this.orders = orders;
    });

    this.ordersFacade.total$.pipe(takeUntil(this.destroy$)).subscribe(total => {
      this.total = total;
    });
  }

  increaseAmount(order: Order) {
    this.modifyOrder({
      ...order,
      quantity: order.quantity + 1,
    });
  }

  decreaseAmount(order: Order) {
    this.modifyOrder({
      ...order,
      quantity: order.quantity - 1,
    });
  }

  modifyOrder(order: Order) {
    this.ordersFacade.modifyOrder(order);
  }

  removeOrder(order: Order) {
    this.modifyOrder({
      ...order,
      quantity: 0,
    });
  }

  trackByFn(index: number, order: Order) {
    return order.id;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
