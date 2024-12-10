import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CustomerService } from '../../services/customer.service';
import Swal from 'sweetalert2'
import { GoogleChartsModule, ChartType } from 'angular-google-charts';
import moment from 'moment';

@Component({
  selector: 'app-seller-dashboard',
  standalone: true,
  imports: [CommonModule, GoogleChartsModule],
  templateUrl: './seller-dashboard.component.html',
  styleUrl: './seller-dashboard.component.css',
})
export class SellerDashboardComponent implements OnInit {
  public orderChartType: ChartType = ChartType.ColumnChart;
  public productChartType: ChartType = ChartType.ColumnChart;

  order_dashboard_data: any;
  total_order: any;
  last_order_date: any;

  product_dashboard_data: any;
  total_product: number = 0;
  publish_product: number = 0;
  inactive_product: number = 0;
  draft_product: number = 0;

  public orderChartData: any[] = [];
  public productChartData: any[] = [];

  public orderColumnNames = ['Time Period', 'Total Orders'];
  public productColumnNames = ['Time Period', 'Publish', 'Inactive', 'Draft'];

  public orderChartOptions = {
    title: 'Order Status by Type',
    chartArea: { width: '60%' },
    hAxis: {
      title: 'Time Period',
    },
    vAxis: {
      title: 'Number of Orders',
    },
    series: {
      0: { color: 'blue', type: 'bars', targetAxisIndex: 0 },
    },
    vAxes: {
      0: { title: 'Total Orders' },
    },
  };

  public productChartOptions = {
    title: 'Product Status by Type',
    chartArea: { width: '60%' },
    hAxis: {
      title: 'Time Period',
    },
    vAxis: {
      title: 'Number of Products',
    },
    series: {
      0: { color: 'blue' },
      1: { color: 'green' },
      2: { color: 'red' },
    },
  };

  constructor(private serv: CustomerService, private router: Router) {}

  ngOnInit(): void {
    this.sellerOrderDashboardData();
    this.sellerProductDashboardData();
  }

  sellerProductDashboard() {
    this.router.navigate(['seller/product']);
  }

  preventNavigation(event: Event) {
    event.stopPropagation();
    event.preventDefault();
    Swal.fire('This option only for Admin.You cannot access this 🙄!');
  }

  sellerOrderDashboardData() {
    this.serv.orderDashboardData().subscribe(
      (data) => {
        this.order_dashboard_data = data;
        this.processOrderData();
      },
      (error) => {
        console.log('My error data', error);
      }
    );
  }

  sellerProductDashboardData() {
    this.serv.productDashboardData().subscribe(
      (data) => {
        this.product_dashboard_data = data;
        this.processProductData();
      },
      (error) => {
        console.log('My error', error);
      }
    );
  }

  processOrderData() {
    const weeklyData: Record<string, number> = {};
    const monthlyData: Record<string, number> = {};

    for (let user of this.order_dashboard_data) {
      let registrationDate = moment(user.registrationDate);
      let orderDate = moment(user.orderDate); 

      // Weekly data
      let week = registrationDate.startOf('week').format('YYYY-MM-DD');
      if (!weeklyData[week]) {
        weeklyData[week] = 0;
      }
      weeklyData[week]++;

      // Monthly data
      let month = registrationDate.startOf('month').format('YYYY-MM');
      if (!monthlyData[month]) {
        monthlyData[month] = 0;
      }
      monthlyData[month]++;
    }

    // Prepare data for chart
    this.orderChartData = [['Time Period', 'Total Orders']];
    for (let week in weeklyData) {
      this.orderChartData.push([
        week, 
        weeklyData[week]
      ]);
    }
    for (let month in monthlyData) {
      this.orderChartData.push([
        month, 
        monthlyData[month]
      ]);
    }
  }

  processProductData() {
    const weeklyProductData: Record<
      string,
      { published: number; inactive: number; draft: number }
    > = {};
    const monthlyProductData: Record<
      string,
      { published: number; inactive: number; draft: number }
    > = {};

    for (let product of this.product_dashboard_data) {
      let statusDate = moment(product.statusDate);

      // Weekly data
      let week = statusDate.startOf('week').format('YYYY-MM-DD');
      if (!weeklyProductData[week]) {
        weeklyProductData[week] = { published: 0, inactive: 0, draft: 0 };
      }
      if (product.status === 'publish') {
        weeklyProductData[week].published++;
      } else if (product.status === 'inactive') {
        weeklyProductData[week].inactive++;
      } else if (product.status === 'draft') {
        weeklyProductData[week].draft++;
      }

      // Monthly data
      let month = statusDate.startOf('month').format('YYYY-MM');
      if (!monthlyProductData[month]) {
        monthlyProductData[month] = { published: 0, inactive: 0, draft: 0 };
      }
      if (product.status === 'publish') {
        monthlyProductData[month].published++;
      } else if (product.status === 'inactive') {
        monthlyProductData[month].inactive++;
      } else if (product.status === 'draft') {
        monthlyProductData[month].draft++;
      }

      // Product count
      if (product.status === 'publish') {
        this.publish_product++;
      } else if (product.status === 'inactive') {
        this.inactive_product++;
      } else if (product.status === 'draft') {
        this.draft_product++;
      }
      this.total_product++;
    }

    // Prepare data for product chart
    this.productChartData = [];
    for (let week in weeklyProductData) {
      this.productChartData.push([
        week,
        weeklyProductData[week].published,
        weeklyProductData[week].inactive,
        weeklyProductData[week].draft,
      ]);
    }
    for (let month in monthlyProductData) {
      this.productChartData.push([
        month,
        monthlyProductData[month].published,
        monthlyProductData[month].inactive,
        monthlyProductData[month].draft,
      ]);
    }
  }
}