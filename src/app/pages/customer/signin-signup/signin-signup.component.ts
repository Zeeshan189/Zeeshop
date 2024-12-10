import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LoginSignupService } from '../../shared/services/login-signup.service';
import { HttpClientModule } from '@angular/common/http';
import Swal from 'sweetalert2';
import { DemoNgZorroAntdModule } from '../../../ng-zorro-antd.module';

@Component({
  selector: 'app-signin-signup',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    HttpClientModule,
    FormsModule,
    DemoNgZorroAntdModule,
  ],
  templateUrl: './signin-signup.component.html',
  styleUrl: './signin-signup.component.css',
})
export class SigninSignupComponent {
  selectedValue: any;
  passwordVisible = false;
  regForm: boolean = false;
  href: string = '';
  user_data: any;
  validateForm!: FormGroup;

  constructor(
    private fb: NonNullableFormBuilder,
    private serv: LoginSignupService,
    private route: Router
  ) {
    this.href = this.route.url;
    if (this.href == '/sign-up') {
      this.regForm = true;
      this.validateForm = this.fb.group({
        name: ['', [Validators.required]],
        mobile: ['', [Validators.required]],
        email: ['', [Validators.email, Validators.required]],
        password: ['', [Validators.required]],
        address: ['', [Validators.required]],
        city: ['', [Validators.required]],
        code: ['', [Validators.required]],
        gender: ['', [Validators.required]],
        image: ['', [Validators.required]],
        role: ['', [Validators.required]],
      });
    } else if (this.href == '/sign-in') {
      this.regForm = false;
      this.validateForm = this.fb.group({
        email: [null, [Validators.email, Validators.required]],
        password: [null, [Validators.required]],
      });
    }
  }

  onSubmitSignUp() {
    const userData = { ...this.validateForm.value };
    const email = this.validateForm.get('email')?.value;

    this.serv.checkDuplicateEmail().subscribe((res) => {
      this.user_data = res;
      const user = this.user_data.find((user: any) => user.email === email);
      if (user) {
        Swal.fire('Email already exists. Please use a different email 🙄!');
      } else {
        this.serv.userRegister(userData).subscribe((res) => {
          Swal.fire('User Add Successfully 😊!');
          this.validateForm.reset();
          this.route.navigate(['sign-in']);
        });
      }
    });
  }

  submitForm() {
    const email = this.validateForm.get('email')?.value;
    const password = this.validateForm.get('password')?.value;

    this.serv.authLogin(email, password).subscribe(
      (data) => {
        this.user_data = data;
        if (this.user_data.length === 1) {
          const user = this.user_data[0];
          if (user.email === email && user.password === password) {
            if (user.role === 'seller') {
              sessionStorage.setItem('user_session_id', user.id);
              sessionStorage.setItem('role', user.role);
              this.route.navigate(['seller-dashboard']);
            } else if (user.role === 'buyer') {
              sessionStorage.setItem('user_session_id', user.id);
              sessionStorage.setItem('role', user.role);
              this.route.navigate(['buyer-dashboard']);
              this.route.navigate(['home']);
            } else {
              Swal.fire('Invalid login details 😠!');
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
