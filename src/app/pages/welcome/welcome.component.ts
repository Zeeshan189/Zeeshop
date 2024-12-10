import { CommonModule } from '@angular/common';
import { Component, OnInit, Renderer2 } from '@angular/core';
import { RouterLink, RouterOutlet, Router } from '@angular/router';
import { DemoNgZorroAntdModule } from '../../ng-zorro-antd.module';
import { CustomerService } from '../customer/services/customer.service';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [RouterLink, CommonModule, RouterOutlet, DemoNgZorroAntdModule],
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.css',
})
export class WelcomeComponent implements OnInit {
  menuVisible = false;
  logged_in: boolean = false;
  user_role!: any;
  user_id!: string | null;
  isDarkMode: boolean = false;

  constructor(
    private customerService: CustomerService,
    private router: Router,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    this.isDarkMode = localStorage.getItem('darkMode') === 'true';
    this.updateMode();
  }

  ngDoCheck() {
    this.user_role = sessionStorage.getItem('role');
    this.user_id = sessionStorage.getItem('user_session_id');
    this.logged_in = !!this.user_id;
  }

  getcartitemcount(): number {
    if (this.user_id) {
      return this.customerService.getCartItemCount(this.user_id);
    }
    return 0;
  }

  dashboardf() {
    const role = sessionStorage.getItem('role');

    if (role === 'admin') {
      this.router.navigate(['/admin-dashboard']);
    } else if (role === 'seller') {
      this.router.navigate(['/seller-dashboard']);
    } else if (role === 'buyer') {
      this.router.navigate(['/home']);
    } else {
      this.router.navigate(['/sign-in']);
    }
  }

  toggleMenu() {
    this.menuVisible = !this.menuVisible;
  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    localStorage.setItem('darkMode', this.isDarkMode.toString());
    this.updateMode();
  }

  updateMode() {
    if (this.isDarkMode) {
      this.renderer.addClass(document.body, 'dark-mode');
    } else {
      this.renderer.removeClass(document.body, 'dark-mode');
    }
  }

  logout() {
    sessionStorage.removeItem('user_session_id');
    sessionStorage.removeItem('role');
    this.logged_in = false;

    sessionStorage.removeItem('authLoginData');
    sessionStorage.removeItem('adminLoginData');

    switch (this.user_role) {
      case 'admin':
        this.router.navigate(['admin-login']);
        break;
      case 'seller':
      case 'buyer':
        this.router.navigate(['sign-in']);
        break;
      default:
        this.router.navigate(['sign-in']);
        break;
    }
  }
}
