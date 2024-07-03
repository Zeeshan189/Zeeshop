import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { User } from '../../core/Model/object.model';
import { LoginSignupService } from '../../shared/services/login-signup.service';
import { HttpClientModule } from '@angular/common/http';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-signin-signup',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    HttpClientModule,
    FormsModule,
  ],
  templateUrl: './signin-signup.component.html',
  styleUrl: './signin-signup.component.css',
})
export class SigninSignupComponent {
  regForm: boolean = false;
  signUpfrom!: FormGroup;
  signInfrom!: FormGroup;
  signUpsubmitted = false;
  href: string = '';
  user_data: any;
  user_dto!: User;
  user_reg_data: any;
  signInFormValue: any = {};

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private loginService: LoginSignupService
  ) {}

  ngOnInit(): void {
    this.href = this.router.url;
    if (this.href == '/sign-up') {
      this.regForm = true;
    } else if (this.href == '/sign-in') {
      this.regForm = false;
    }
    this.signUpfrom = this.formBuilder.group({
      name: ['', Validators.required],
      mobNumber: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      addLine1: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zipCode: ['', Validators.required],
      gender: ['', Validators.required],
      uploadPhoto: ['', Validators.required],
      agreetc: ['', Validators.required],
      role: ['', Validators.required],
    });
  }

  get rf() {
    return this.signUpfrom.controls;
  }

  onSubmitSignUp() {
    debugger;
    if (this.signUpfrom.invalid) {
      Object.values(this.signUpfrom.controls).forEach((control) => {
        control.markAsTouched();
      });
      Swal.fire('Please fill out all required fields 🙄!');
      return;
    }

    const email = this.signUpfrom.get('email')?.value;

    this.loginService.checkDuplicateEmail().subscribe(
      (res) => {
        this.user_data = res;
        const user = this.user_data.find((user: any) => user.email === email);
        if (user) {
          Swal.fire('Email already exists. Please use a different email 🙄!');
        } else {
          this.user_reg_data = this.signUpfrom.value;
          this.user_dto = {
            agreetc: this.user_reg_data.agreetc,
            email: this.user_reg_data.email,
            gender: this.user_reg_data.gender,
            address: {
              addLine1: this.user_reg_data.addLine1,
              city: this.user_reg_data.city,
              state: this.user_reg_data.state,
              zipCode: this.user_reg_data.zipCode,
            },
            mobNumber: this.user_reg_data.mobNumber,
            name: this.user_reg_data.name,
            password: this.user_reg_data.password,
            uploadPhoto: this.user_reg_data.uploadPhoto,
            role: this.user_reg_data.role,
          };
          this.loginService.userRegister(this.user_dto).subscribe(
            (data) => {
              Swal.fire({
                position: 'center',
                icon: 'success',
                title: `You are registered Successfully 😊!`,
                showConfirmButton: false,
                timer: 1500,
              });
              this.router.navigate(['sign-in']);
            },
            (error) => {
              alert('An error occurred during registration. Please try again.');
              console.error(error);
            }
          );
        }
      },
      (error) => {
        alert('An error occurred while checking the email. Please try again.');
        console.error(error);
      }
    );
  }

  onSubmitSignIn() {
    this.loginService
      .authLogin(
        this.signInFormValue.userEmail,
        this.signInFormValue.userPassword
      )
      .subscribe(
        (data) => {
          this.user_data = data;
          if (this.user_data.length === 1) {
            const user = this.user_data[0];
            if (
              user.email === this.signInFormValue.userEmail &&
              user.password === this.signInFormValue.userPassword
            ) {
              if (user.role === 'seller') {
                sessionStorage.setItem('user_session_id', user.id);
                sessionStorage.setItem('role', user.role);
                this.router.navigate(['seller-dashboard']);
              } else if (user.role === 'buyer') {
                sessionStorage.setItem('user_session_id', user.id);
                sessionStorage.setItem('role', user.role);
                this.router.navigate(['buyer-dashboard']);
              } else {
                Swal.fire('Invalid login details 😠!')
              }
            } else {
              Swal.fire("Email or Password do not match 🤔!");
            }
          } else {
            Swal.fire('Email or password is incorrect 🙄!');
          }
          console.log(this.user_data);
        },
        (error) => {
          console.log('Error occurred during login:', error);
          alert('An error occurred during login. Please try again.');
        }
      );
  }
}
