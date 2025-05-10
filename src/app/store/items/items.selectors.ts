import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ItemsEntityState, itemsAdapter } from './items.reducer';

export const selectItemsState = createFeatureSelector<ItemsEntityState>('items');

// Entity selectors
export const {
  selectAll: selectAllItems,
  selectEntities: selectItemEntities,
  selectIds: selectItemIds,
  selectTotal: selectTotalItems,
} = itemsAdapter.getSelectors(selectItemsState);

export const selectPagination = createSelector(
  selectItemsState,
  (state: ItemsEntityState) => state.pagination,
);

export const selectLoading = createSelector(
  selectItemsState,
  (state: ItemsEntityState) => state.loading,
);

// Combined selector for components that need both pagination and shoes
export const selectPaginationWithItems = createSelector(
  selectPagination,
  selectAllItems,
  (pagination, shoes) => ({
    ...pagination,
    shoes,
  }),
);
