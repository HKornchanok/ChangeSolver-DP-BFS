import { EntityState } from '@ngrx/entity';
import { Shoe } from './item.interface';

export interface Order extends Shoe {
  quantity: number;
}

export interface OrderState extends EntityState<Order> {
  total: number;
}
