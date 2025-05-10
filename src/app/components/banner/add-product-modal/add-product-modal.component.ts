import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Shoe } from '../../../interfaces/item.interface';

@Component({
  selector: 'app-add-product-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-product-modal.component.html',
  styleUrls: ['./add-product-modal.component.css'],
})
export class AddProductModalComponent implements OnInit {
  @Output() closeModal = new EventEmitter<void>();
  @Output() createProduct = new EventEmitter<Shoe>();

  productForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.maxLength(100)]],
      price: [
        '',
        [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/), Validators.min(0.01)],
      ],
    });
  }

  ngOnInit() {}

  onSubmit() {
    if (this.productForm.valid) {
      this.createProduct.emit(this.productForm.value);
      this.closeModal.emit();
    }
  }

  onClose() {
    this.closeModal.emit();
  }
}
