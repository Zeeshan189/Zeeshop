import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CustomerService } from '../../services/customer.service';
import Swal from 'sweetalert2';
import { Product } from '../../../core/Model/object.model';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime } from 'rxjs';

@Component({
  selector: 'app-buyer-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './buyer-dashboard.component.html',
  styleUrl: './buyer-dashboard.component.css',
})
export class BuyerDashboardComponent implements OnInit {
  all_products: any;
  user_id!: string;
  paginated_products: Product[] = [];
  current_page: number = 1;
  items_per_page: number = 8;
  searchControl: FormControl = new FormControl('');
  Math = Math;

  constructor(
    private router: Router,
    private customerService: CustomerService
  ) {}

  ngOnInit(): void {
    this.user_id = String(sessionStorage.getItem('user_session_id'));
    this.getAllProduct();
    this.searchControl.valueChanges.pipe(debounceTime(300)).subscribe(() => {
      this.searchProducts();
    });
  }

  getAllProduct() {
    this.customerService.allProduct().subscribe(
      (data: Product[]) => {
        this.all_products = data.filter(
          (product: any) => product.status === 'publish'
        );
        this.setPage(1);
      },
      (error) => {
        console.log('My error', error);
      }
    );
  }

  setPage(page: number) {
    this.current_page = page;
    const start = (page - 1) * this.items_per_page;
    const end = start + this.items_per_page;
    this.paginated_products = this.filteredProducts.slice(start, end);
  }

  get filteredProducts(): Product[] {
    if (!this.searchControl.value) {
      return this.all_products;
    }
    return this.all_products.filter((product: Product) =>
      product.name.toLowerCase().includes(this.searchControl.value.toLowerCase())
    );
  }

  searchProducts() {
    this.setPage(1);
  }

  AddtoCart(product: Product): void {
    const quantity = this.customerService.addToCart(product, this.user_id);

    Swal.fire({
      position: 'center',
      icon: 'success',
      title: `Added to Cart Successfully. Quantity: ${quantity}`,
      showConfirmButton: false,
      timer: 1500,
    });
  }
}
