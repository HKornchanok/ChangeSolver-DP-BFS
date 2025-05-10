import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Shoe } from '../../interfaces/item.interface';
import { ItemsFacade } from '../../store/items/items.facade';
import { AddProductModalComponent } from './add-product-modal/add-product-modal.component';

@Component({
  selector: 'app-banner',
  standalone: true,
  imports: [CommonModule, AddProductModalComponent],
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss'],
})
export class BannerComponent {
  showModal = false;
  constructor(private itemsFacade: ItemsFacade) {}

  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  onCreateProduct(product: Shoe) {
    this.closeModal();
    this.itemsFacade.addItem(product);
  }
}
