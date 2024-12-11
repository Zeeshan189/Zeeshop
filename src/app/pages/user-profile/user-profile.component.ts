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
import { UserService } from '../shared/services/user.service';
import { User } from '../core/Model/object.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterLink],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css',
})
export class UserProfileComponent implements OnInit {
  userProfileForm!: FormGroup;
  userProfile: boolean = false;
  user_id!: string;
  user_data: any;
  user_update_data: any;
  user_dto!: User;
  user_role: any;
  showPassword = false;
  edit_profile!: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private user_Service: UserService
  ) {}

  ngOnInit(): void {
    this.user_id = String(sessionStorage.getItem('user_session_id'));
    this.userProfileForm = this.formBuilder.group({
      name: ['', Validators.required],
      mobNumber: ['', Validators.required],
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
      address: ['', Validators.required],
      city: ['', Validators.required],
      zipCode: ['', Validators.required],
      gender: ['', Validators.required],
      role: ['', [Validators.required]],
    });
    this.editUserData(this.user_id);
  }

  get rf() {
    return this.userProfileForm.controls;
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  editUserData(id: any) {
    this.user_Service.getUserData(id).subscribe(
      (data) => {
        this.user_data = data;
        this.user_role = this.user_data.role;
        this.userProfileForm.setValue({
          name: this.user_data.name,
          mobNumber: this.user_data.mobNumber,
          email: this.user_data.email,
          password: this.user_data.password,
          gender: this.user_data.gender,
          address: this.user_data.address,
          city: this.user_data.city,
          zipCode: this.user_data.zipCode,
          role: this.user_data.role,
        });
      },
      (error) => {
        console.log('My error', error);
      }
    );
  }

  updateProfile() {
    this.userProfile = true;
    if (this.userProfileForm.invalid) {
      return;
    }
    this.user_update_data = this.userProfileForm.value;
    this.user_dto = {
      id: this.user_update_data,
      agreetc: this.user_update_data.agreetc,
      email: this.user_update_data.email,
      gender: this.user_update_data.gender,
      address: this.user_update_data.address,
      city: this.user_update_data.city,
      zipCode: Number(this.user_update_data.zipCode),
      mobNumber: this.user_update_data.mobNumber,
      name: this.user_update_data.name,
      password: this.user_update_data.password,
      role: this.user_update_data.role,
    };
    this.user_Service.updateUserData(this.user_id, this.user_dto).subscribe(
      (data) => {
        Swal.fire('Profile Update Successfully 😊!');
        if (this.user_role == 'admin') {
          this.router.navigate(['admin-dashboard']);
        } else if (this.user_role == 'seller') {
          this.router.navigate(['seller-dashboard']);
        } else if (this.user_role == 'buyer') {
          this.router.navigate(['buyer-dashboard']);
        }
      },
      (error) => {
        console.log('My error', error);
      }
    );
  }
}
