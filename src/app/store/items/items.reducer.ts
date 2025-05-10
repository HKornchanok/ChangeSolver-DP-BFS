import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { Shoe } from '../../interfaces/item.interface';
import * as ItemsActions from './items.actions';

export const itemsAdapter = createEntityAdapter<Shoe>({
  selectId: (shoe: Shoe) => shoe.id || 0,
  sortComparer: (a, b) => {
    const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
    const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
    return dateB - dateA; // descending order (newest first)
  },
});

export interface ItemsEntityState extends EntityState<Shoe> {
  pagination: {
    page: number;
    total: number;
    complete: boolean;
    reset: boolean;
    searchTerm?: string;
  };
  loading: boolean;
}

export const initialState: ItemsEntityState = itemsAdapter.getInitialState({
  pagination: {
    page: 0,
    total: 0,
    complete: false,
    reset: false,
    searchTerm: '',
  },
  loading: false,
});

export const itemsReducer = createReducer(
  initialState,
  on(ItemsActions.browseItems, state => ({
    ...state,
    loading: true,
  })),
  on(ItemsActions.browseItemsSuccess, (state, { pagination }) => {
    if (pagination.reset) {
      return itemsAdapter.setAll(pagination.shoes, {
        ...state,
        loading: false,
        pagination: {
          page: pagination.page,
          total: pagination.total,
          complete: pagination.complete,
          reset: pagination.reset,
          searchTerm: pagination.searchTerm,
        },
      });
    }
    return itemsAdapter.addMany(pagination.shoes, {
      ...state,
      loading: false,
      pagination: {
        page: pagination.page,
        total: pagination.total,
        complete: pagination.complete,
        reset: pagination.reset,
        searchTerm: pagination.searchTerm,
      },
    });
  }),
  on(ItemsActions.browseItemsFailure, state => ({
    ...state,
    loading: false,
  })),
  on(ItemsActions.addItem, state => ({
    ...state,
    loading: true,
  })),
  on(ItemsActions.addItemSuccess, (state, { item }) =>
    itemsAdapter.addOne(item, {
      ...state,
      loading: false,
    }),
  ),
  on(ItemsActions.addItemFailure, state => ({
    ...state,
    loading: false,
  })),
);
