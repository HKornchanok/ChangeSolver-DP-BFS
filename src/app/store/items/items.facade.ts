import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Pagination, Shoe } from '../../interfaces/item.interface';
import * as ItemsActions from './items.actions';
import { selectAllItems, selectLoading, selectPaginationWithItems } from './items.selectors';

@Injectable({
  providedIn: 'root',
})
export class ItemsFacade {
  readonly items$: Observable<Shoe[]>;
  readonly pagination$: Observable<Pagination & { shoes: Shoe[] }>;
  readonly loading$: Observable<boolean>;
  constructor(private store: Store) {
    this.items$ = this.store.select(selectAllItems);
    this.pagination$ = this.store.select(selectPaginationWithItems);
    this.loading$ = this.store.select(selectLoading);
  }

  browseItems(pagination: Pagination, forceReset: boolean): void {
    this.store.dispatch(ItemsActions.browseItems({ pagination, forceReset }));
  }

  addItem(item: Shoe): void {
    this.store.dispatch(ItemsActions.addItem({ item }));
  }
}
