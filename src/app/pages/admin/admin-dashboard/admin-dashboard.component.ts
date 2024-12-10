import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from '../services/admin.service';
import { CommonModule } from '@angular/common';
import moment from 'moment';
import { GoogleChartsModule, ChartType } from 'angular-google-charts';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, GoogleChartsModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css',
})
export class AdminDashboardComponent implements OnInit {
  public userChartType: ChartType = ChartType.ColumnChart;
  public productChartType: ChartType = ChartType.ColumnChart;

  user_dashboard_data: any;
  total_user: number = 0;
  admin_user: number = 0;
  seller_user: number = 0;
  buyer_user: number = 0;

  product_dashboard_data: any;
  total_product: number = 0;
  publish_product: number = 0;
  inactive_product: number = 0;
  draft_product: number = 0;

  public userChartData: any[] = [];
  public productChartData: any[] = [];

  public userColumnNames = ['Time Period', 'Total Users', 'Sellers', 'Buyers'];
  public productColumnNames = ['Time Period', 'Published', 'Inactive', 'Draft'];

  public userChartOptions = {
    title: 'User Registrations by Type',
    chartArea: { width: '60%' },
    hAxis: {
      title: 'Time Period',
    },
    vAxis: {
      title: 'Number of Users',
    },
    series: {
      0: { color: 'blue' },
      1: { color: 'green' },
      2: { color: 'red' },
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

  constructor(private router: Router, private admin: AdminService) {}

  ngOnInit(): void {
    this.adminProductDashboard();
    this.adminUserDashboardData();
  }

  userDashboard() {
    this.router.navigate(['admin/user']);
  }

  productDashboard() {
    this.router.navigate(['admin/product']);
  }

  adminUserDashboardData() {
    this.admin.userDashboardData().subscribe(
      (data) => {
        this.user_dashboard_data = data;
        this.processUserData();
      },
      (error) => {
        console.log('My error', error);
      }
    );
  }

  adminProductDashboard() {
    this.admin.productDashboardData().subscribe(
      (data) => {
        this.product_dashboard_data = data;
        this.processProductData();
      },
      (error) => {
        console.log('My error', error);
      }
    );
  }

  processUserData() {
    const weeklyUserData: Record<
      string,
      { total: number; sellers: number; buyers: number }
    > = {};
    const monthlyUserData: Record<
      string,
      { total: number; sellers: number; buyers: number }
    > = {};

    for (let user of this.user_dashboard_data) {
      let registrationDate = moment(user.registrationDate);

      // Weekly data
      let week = registrationDate.startOf('week').format('YYYY-MM-DD');
      if (!weeklyUserData[week]) {
        weeklyUserData[week] = { total: 0, sellers: 0, buyers: 0 };
      }
      weeklyUserData[week].total++;
      if (user.role === 'seller') {
        weeklyUserData[week].sellers++;
      } else if (user.role === 'buyer') {
        weeklyUserData[week].buyers++;
      }

      // Monthly data
      let month = registrationDate.startOf('month').format('YYYY-MM');
      if (!monthlyUserData[month]) {
        monthlyUserData[month] = { total: 0, sellers: 0, buyers: 0 };
      }
      monthlyUserData[month].total++;
      if (user.role === 'seller') {
        monthlyUserData[month].sellers++;
      } else if (user.role === 'buyer') {
        monthlyUserData[month].buyers++;
      }

      // Role count
      if (user.role === 'admin') {
        this.admin_user++;
      } else if (user.role === 'seller') {
        this.seller_user++;
      } else if (user.role === 'buyer') {
        this.buyer_user++;
      }
      this.total_user++;
    }

    // Prepare data for user chart
    this.userChartData = [];
    for (let week in weeklyUserData) {
      this.userChartData.push([
        week,
        weeklyUserData[week].total,
        weeklyUserData[week].sellers,
        weeklyUserData[week].buyers,
      ]);
    }
    for (let month in monthlyUserData) {
      this.userChartData.push([
        month,
        monthlyUserData[month].total,
        monthlyUserData[month].sellers,
        monthlyUserData[month].buyers,
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
