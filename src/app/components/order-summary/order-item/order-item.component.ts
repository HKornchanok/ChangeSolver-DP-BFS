import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-order-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-item.component.html',
  styleUrls: ['./order-item.component.css'],
})
export class OrderItemComponent {
  @Input() order: any;
  @Output() increase = new EventEmitter<any>();
  @Output() decrease = new EventEmitter<any>();
  @Output() remove = new EventEmitter<any>();

  onIncrease() {
    this.increase.emit(this.order);
  }

  onDecrease() {
    this.decrease.emit(this.order);
  }

  onRemove() {
    this.remove.emit(this.order);
  }
}
