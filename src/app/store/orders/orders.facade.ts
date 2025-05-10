import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Order } from '../../interfaces/orders.interfaces';
import * as OrdersActions from './orders.actions';
import { selectAllOrders, selectTotal } from './orders.selectors';

const ORDERS_STORAGE_KEY = 'orders_state';

@Injectable({
  providedIn: 'root',
})
export class OrdersFacade {
  readonly orders$: Observable<Order[]>;
  readonly total$: Observable<number>;

  constructor(private store: Store) {
    this.orders$ = this.store.select(selectAllOrders);
    this.total$ = this.store.select(selectTotal);

    // Subscribe to orders changes to save to local storage
    this.orders$.subscribe(orders => {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
    });
  }

  modifyOrder(order: Order): void {
    this.store.dispatch(OrdersActions.modifyOrder({ order }));
  }
}
