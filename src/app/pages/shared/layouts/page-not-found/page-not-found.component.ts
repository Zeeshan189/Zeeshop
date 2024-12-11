import { CommonModule, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-page-not-found',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './page-not-found.component.html',
  styleUrl: './page-not-found.component.css',
})
export class PageNotFoundComponent {
  constructor(private router: Router) {}

  Backf() {
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
}
