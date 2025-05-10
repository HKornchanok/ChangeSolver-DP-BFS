import { createFeatureSelector, createSelector } from '@ngrx/store';
import { OrderState } from '../../interfaces/orders.interfaces';
import { adapter } from './orders.reducer';

export const selectOrdersState = createFeatureSelector<OrderState>('orders');

export const {
  selectAll: selectAllOrders,
  selectEntities: selectOrderEntities,
  selectIds: selectOrderIds,
} = adapter.getSelectors(selectOrdersState);

export const selectTotal = createSelector(selectOrdersState, (state: OrderState) => state.total);
