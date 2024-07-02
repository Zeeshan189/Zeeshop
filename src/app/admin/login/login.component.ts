import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginSignupService } from '../../shared/services/login-signup.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})

export class LoginComponent implements OnInit {
  signInFormValue: any = {};
  user_data: any;

  constructor(
    private router: Router,
    private loginService: LoginSignupService
  ) {}

  ngOnInit(): void {}

  onSubmitSignIn() {
    this.loginService
      .adminLogin(
        this.signInFormValue.userEmail,
        this.signInFormValue.userPassword
      )
      .subscribe(
        (data) => {
          this.user_data = data;
          if (this.user_data && this.user_data.length === 1 && this.user_data[0].email === this.signInFormValue.userEmail && this.user_data[0].password === this.signInFormValue.userPassword) {
            sessionStorage.setItem('user_session_id', this.user_data[0].id);
            sessionStorage.setItem('role', this.user_data[0].role);
            const Toast = Swal.mixin({
              toast: true,
              position: "top-end",
              showConfirmButton: false,
              timer: 3000,
              timerProgressBar: true,
              didOpen: (toast) => {
                toast.onmouseenter = Swal.stopTimer;
                toast.onmouseleave = Swal.resumeTimer;
              }
            });
            Toast.fire({
              icon: "success",
              title: "Signed in successfully"
            });
            this.router.navigate(['admin-dashboard']);
          } else {
            alert('Invalid email or password');
          }
          console.log(this.user_data);
        },
        (error) => {
          console.log('My Error', error);
        }
      );
  }
  
}