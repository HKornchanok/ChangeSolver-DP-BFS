import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { from, of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { ItemService } from './item.service';
import * as ItemsActions from './items.actions';

@Injectable()
export class ItemsEffects {
  private actions = inject(Actions);
  private itemService = inject(ItemService);

  // Browse Items
  browseItems$ = createEffect(() =>
    this.actions.pipe(
      ofType(ItemsActions.browseItems),
      mergeMap(({ pagination, forceReset }) =>
        from(this.itemService.browse(pagination, forceReset)).pipe(
          map(newPagination => ItemsActions.browseItemsSuccess({ pagination: newPagination })),
          catchError(error => of(ItemsActions.browseItemsFailure({ error }))),
        ),
      ),
    ),
  );

  addItem$ = createEffect(() =>
    this.actions.pipe(
      ofType(ItemsActions.addItem),
      mergeMap(({ item }) =>
        from(this.itemService.addItem(item)).pipe(
          map(newItem => ItemsActions.addItemSuccess({ item: newItem })),
          catchError(error => of(ItemsActions.addItemFailure({ error }))),
        ),
      ),
    ),
  );
}
