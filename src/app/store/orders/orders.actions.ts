import { createAction, props } from '@ngrx/store';
import { Order } from '../../interfaces/orders.interfaces';

export enum ActionTypes {
  ModifyOrder = '[Orders] Modify Order',
  ModifyOrderSuccess = '[Orders] Modify Order Success',
  InitializeOrders = '[Orders] Initialize Orders',
}

// Modify Order
export const modifyOrder = createAction(ActionTypes.ModifyOrder, props<{ order: Order }>());
export const modifyOrderSuccess = createAction(
  ActionTypes.ModifyOrderSuccess,
  props<{ order: Order }>(),
);

// Initialize Orders
export const initializeOrders = createAction(
  ActionTypes.InitializeOrders,
  props<{ orders: Order[] }>(),
);
