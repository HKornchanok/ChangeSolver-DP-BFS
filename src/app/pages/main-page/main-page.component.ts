import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { BannerComponent } from '../../components/banner/banner.component';
import { OrderSummaryComponent } from '../../components/order-summary/order-summary.component';
import { PaymentSummaryComponent } from '../../components/payment-summary/payment-summary.component';
import { ProductListComponent } from '../../components/product-list/product-list.component';
import { SearchBarComponent } from '../../components/search-bar/search-bar.component';
@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    BannerComponent,
    ProductListComponent,
    OrderSummaryComponent,
    PaymentSummaryComponent,
    SearchBarComponent,
  ],
})
export class MainPageComponent {}
