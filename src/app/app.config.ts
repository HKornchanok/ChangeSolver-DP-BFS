import { ApplicationConfig, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { routes } from './app.routes';
import { ItemsEffects } from './store/items/items.effects';
import { itemsReducer } from './store/items/items.reducer';
import { OrdersEffects } from './store/orders/orders.effects';
import { ordersReducer } from './store/orders/orders.reducer';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideStore({ items: itemsReducer, orders: ordersReducer }),
    provideEffects([ItemsEffects, OrdersEffects]),
    provideStoreDevtools({
      maxAge: 25,
      logOnly: !isDevMode(),
      autoPause: true,
      trace: false,
      traceLimit: 75,
    }),
  ],
};
