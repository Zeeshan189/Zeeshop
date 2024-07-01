import { CommonModule } from '@angular/common';
import { Component, OnInit, Renderer2 } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CustomerService } from '../../../customer/services/customer.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit {
  logged_in: boolean = false;
  user_role!: any;
  user_id!: string | null;
  isDarkMode: boolean = false;

  constructor(
    private router: Router,
    private customerService: CustomerService,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    this.isDarkMode = localStorage.getItem('darkMode') === 'true';
    this.updateMode();
  }

  getcartitemcount(): number {
    if (this.user_id) {
      return this.customerService.getCartItemCount(this.user_id);
    }
    return 0;
  }

  ngDoCheck() {
    this.user_role = sessionStorage.getItem('role');
    this.user_id = sessionStorage.getItem('user_session_id');
    this.logged_in = !!this.user_id;
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

    localStorage.removeItem('authLoginData');
    localStorage.removeItem('adminLoginData');

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
