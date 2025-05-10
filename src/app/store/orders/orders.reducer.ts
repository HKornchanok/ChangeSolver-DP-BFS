import { createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { Order, OrderState } from '../../interfaces/orders.interfaces';
import * as OrdersActions from './orders.actions';

export const adapter: EntityAdapter<Order> = createEntityAdapter<Order>({
  selectId: (order: Order) => order.id ?? 0,
});

export const initialState: OrderState = adapter.getInitialState({
  total: 0,
});

export const ordersReducer = createReducer(
  initialState,
  on(OrdersActions.initializeOrders, (state, { orders }) => {
    const newState = adapter.setAll(orders, state);
    const total = orders.reduce((sum, item) => sum + item.price * item.quantity, 0);
    return {
      ...newState,
      total,
    };
  }),
  on(OrdersActions.modifyOrderSuccess, (state, { order }) => {
    let newState;
    if (order.quantity === 0) {
      newState = adapter.removeOne(order.id ?? 0, state);
    } else {
      newState = adapter.upsertOne(order, state);
    }

    // Calculate new total
    const orders = adapter.getSelectors().selectAll(newState);
    const total = orders.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return {
      ...newState,
      total,
    };
  }),
);
