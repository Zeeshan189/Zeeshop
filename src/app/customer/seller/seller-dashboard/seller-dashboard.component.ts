import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CustomerService } from '../../services/customer.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-seller-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './seller-dashboard.component.html',
  styleUrl: './seller-dashboard.component.css',
})
export class SellerDashboardComponent implements OnInit {
  order_dashboard_data: any;
  total_order: any;
  last_order_date: any;
  product_dashboard_data: any;
  total_product: number = 0;
  publish_product: number = 0;
  inactive_product: number = 0;
  draft_product: number = 0;

  constructor(
    private customerService: CustomerService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.sellerOrderDashboardData();
    this.sellerProductDashboardData();
  }

  sellerProductDashboard() {
    this.router.navigate(['seller/product']);
  }

  sellerOrderDashboard() {
    Swal.fire('This option only for Admin.You cannot access this 🙄!!');
  }

  sellerOrderDashboardData() {
    this.customerService.orderDashboardData().subscribe(
      (data) => {
        this.order_dashboard_data = data;
        console.log('Order Dashboard data', this.order_dashboard_data);
        this.total_order = Number(this.order_dashboard_data.length);
        this.last_order_date =
          this.order_dashboard_data[this.total_order - 1].dateTime;
      },
      (error) => {
        console.log('My error data', error);
      }
    );
  }

  sellerProductDashboardData() {
    this.customerService.productDashboardData().subscribe(
      (data) => {
        this.product_dashboard_data = data;
        for (status in this.product_dashboard_data) {
          console.log(this.product_dashboard_data[status].status);
          if (this.product_dashboard_data[status].status == 'publish') {
            ++this.publish_product;
          } else if (this.product_dashboard_data[status].status == 'inactive') {
            ++this.inactive_product;
          } else if (this.product_dashboard_data[status].status == 'draft') {
            ++this.draft_product;
          }
          ++this.total_product;
        }
      },
      (error) => {
        console.log('My error', error);
      }
    );
  }

}