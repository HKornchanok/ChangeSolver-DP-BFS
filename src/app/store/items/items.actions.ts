import { createAction, props } from '@ngrx/store';
import { Pagination, Shoe } from '../../interfaces/item.interface';

export enum ActionTypes {
  BrowseItems = '[Items] Browse Items',
  BrowseItemsSuccess = '[Items] Browse Items Success',
  BrowseItemsFailure = '[Items] Browse Items Failure',
  AddItem = '[Items] Add Item',
  AddItemSuccess = '[Items] Add Item Success',
  AddItemFailure = '[Items] Add Item Failure',
}

// Add Item
export const addItem = createAction(ActionTypes.AddItem, props<{ item: Shoe }>());
export const addItemSuccess = createAction(ActionTypes.AddItemSuccess, props<{ item: Shoe }>());
export const addItemFailure = createAction(ActionTypes.AddItemFailure, props<{ error: any }>());

export const browseItems = createAction(
  ActionTypes.BrowseItems,
  props<{ pagination: Pagination; forceReset: boolean }>(),
);

export const browseItemsSuccess = createAction(
  ActionTypes.BrowseItemsSuccess,
  props<{ pagination: Pagination }>(),
);

export const browseItemsFailure = createAction(
  ActionTypes.BrowseItemsFailure,
  props<{ error: any }>(),
);
