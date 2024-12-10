import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LoginSignupService } from '../../shared/services/login-signup.service';
import Swal from 'sweetalert2';
import { DemoNgZorroAntdModule } from '../../../ng-zorro-antd.module';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    RouterLink,
    DemoNgZorroAntdModule,
    ReactiveFormsModule,
    CommonModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  signInFormValue: any = {};
  user_data: any;
  passwordVisible = false;
  constructor(
    private route: Router,
    private serv: LoginSignupService,
    private fb: NonNullableFormBuilder
  ) {
    this.signInFormValue = this.fb.group({
      email: [null, [Validators.email, Validators.required]],
      password: [null, [Validators.required]],
    });
  }

  submitForm() {
    const email = this.signInFormValue.get('email')?.value;
    const password = this.signInFormValue.get('password')?.value;

    this.serv.adminLogin(email, password).subscribe(
      (data) => {
        this.user_data = data;
        if (this.user_data.length === 1) {
          const user = this.user_data[0];
          if (user.email === email && user.password === password) {
            sessionStorage.setItem('user_session_id', user.id);
            sessionStorage.setItem('role', user.role);

            if (user.role === 'admin') {
              this.route.navigate(['admin-dashboard']);
              Swal.fire('Sign In Successfully 😊!');
            } else {
              Swal.fire('Invalid role for admin login 😠!');
            }
          } else {
            Swal.fire('Email or password is incorrect 🙄!');
          }
        } else {
          Swal.fire('Email or Password do not match 🤔!');
        }
        console.log(this.user_data);
      },
      (error) => {
        console.log('Error occurred during login:', error);
        alert('An error occurred during login. Please try again.');
      }
    );
  }

  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }
}
