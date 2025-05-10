import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { Subject, takeUntil } from 'rxjs';
import { Pagination, Shoe } from '../../interfaces/item.interface';
import { Order } from '../../interfaces/orders.interfaces';
import { ItemsFacade } from '../../store/items/items.facade';
import { OrdersFacade } from '../../store/orders/orders.facade';
import { ShoeItemComponent } from './shoe-item/shoe-item.component';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
  standalone: true,
  imports: [CommonModule, ShoeItemComponent, InfiniteScrollModule],
})
export class ProductListComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  public pagination!: Pagination;
  public shoes$ = this.itemsFacade.items$;
  public throttle = 300;
  public scrollDistance = 1;
  public scrollUpDistance = 2;
  public loading!: boolean;
  public searchTerm!: string;

  constructor(
    private readonly itemsFacade: ItemsFacade,
    private readonly ordersFacade: OrdersFacade,
  ) {}

  ngOnInit() {
    this.itemsFacade.pagination$.pipe(takeUntil(this.destroy$)).subscribe(pagination => {
      this.pagination = pagination;
      this.searchTerm = pagination.searchTerm ?? '';
    });

    this.itemsFacade.loading$.pipe(takeUntil(this.destroy$)).subscribe(loading => {
      this.loading = loading;
    });

    this.loadInitialItems();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  async loadInitialItems() {
    try {
      this.itemsFacade.browseItems(this.pagination, true);
    } catch (error) {
      console.error('Error loading initial items:', error);
    } finally {
    }
  }

  async onScroll() {
    if (this.pagination.complete) return;

    try {
      // Update the store with new items
      this.itemsFacade.browseItems(this.pagination, false);
    } catch (error) {
      console.error('Error loading more items:', error);
    } finally {
    }
  }

  public trackByFn(index: number, item: Shoe) {
    return item.id;
  }

  public onCartChange(order: Order) {
    this.ordersFacade.modifyOrder(order);
  }
}
