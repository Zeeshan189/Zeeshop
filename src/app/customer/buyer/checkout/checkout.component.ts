import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Product, Order } from '../../../core/Model/object.model';
import { CustomerService } from '../../services/customer.service';
import Swal from 'sweetalert2'
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css',
})

export class CheckoutComponent implements OnInit {
  cartitems: Product[] = [];
  totalamount: number = 0;
  single_product_id: any;
  user_id!: string;
  user_address: any = {};
  user_contact_no: any;

  constructor(
    private customerService: CustomerService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.customerService.currentProduct.subscribe(
      (product) => (this.single_product_id = product)
    );
    this.user_id = String(sessionStorage.getItem('user_session_id'));
    this.cartitems = this.customerService.getCartItem(this.user_id);
    this.userAddress(this.user_id);
    this.calculationamount();
  }

  userAddress(user_id: string) {
    this.customerService.userDetail(user_id).subscribe(
      (data) => {
        this.user_address = data.address;
        this.user_contact_no = data.mobNumber;
      },
      (error) => {
        console.log('My error', error);
      }
    );
  }

  calculationamount() {
    this.totalamount = this.cartitems.reduce(
      (total, item) => total + item.dp * item.quantity,
      0
    );

    this.cartitems.forEach((item) => {
      item.totalPrice = item.dp * item.quantity;
    });
  }

  removeproduct(product: Product): void {
    this.customerService.removeitem(product, this.user_id);
    this.cartitems = this.customerService.getCartItem(this.user_id);
    this.calculationamount();
  }

  checkout(): void {
    const order: Order = {
      userId: this.user_id,
      product: this.cartitems,
      deliveryAddress: this.user_address,
      contact: this.user_contact_no,
      dateTime: new Date().toLocaleDateString(),
    };

    this.customerService.placeOrder(order).subscribe(
      (response) => {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: `You Checkout Successfully!`,
          showConfirmButton: false,
          timer: 1500,
        });

        setTimeout(() => {
          this.customerService.clearCart(this.user_id);
          this.router.navigate(['checkout']);
          location.reload();
        }, 1500);
      },
      (error) => {
        console.log('Error placing order', error);
      }
    );
  }

  updateTotalPrice(item: Product) {
    item.totalPrice = item.dp * item.quantity;
    this.calculationamount(); // Update total amount
  }
}