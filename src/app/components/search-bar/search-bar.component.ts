import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { Pagination } from '../../interfaces/item.interface';
import { ItemsFacade } from '../../store/items/items.facade';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class SearchBarComponent implements OnInit, OnDestroy {
  public searchTerm: string = '';
  public pagination!: Pagination;
  private destroy$ = new Subject<void>();

  constructor(private readonly itemsFacade: ItemsFacade) {}

  ngOnInit() {
    this.itemsFacade.pagination$.pipe(takeUntil(this.destroy$)).subscribe(pagination => {
      this.pagination = { ...pagination };
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSearchTermChange() {
    if (this.searchTerm.length === 0) {
      this.pagination.searchTerm = undefined;
      this.itemsFacade.browseItems(this.pagination, true);
      return;
    }
    if (this.searchTerm.length < 3) {
      return;
    }
    this.pagination.searchTerm = this.searchTerm;
    this.itemsFacade.browseItems(this.pagination, true);
  }
}
