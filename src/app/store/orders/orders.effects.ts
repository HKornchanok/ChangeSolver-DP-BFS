import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map } from 'rxjs/operators';
import * as OrdersActions from './orders.actions';

@Injectable()
export class OrdersEffects {
  constructor(private actions$: Actions) {}

  modifyOrder$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OrdersActions.modifyOrder),
      map(({ order }) => OrdersActions.modifyOrderSuccess({ order })),
    ),
  );
}
