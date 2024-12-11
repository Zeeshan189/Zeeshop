import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AdminService } from '../services/admin.service';
import { Product, User } from '../../core/Model/object.model';
import Swal from 'sweetalert2';
declare var $: any;

@Component({
  selector: 'app-user-crud',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-crud.component.html',
  styleUrl: './user-crud.component.css',
})
export class UserCrudComponent implements OnInit {
  all_user_data: any[] = [];
  single_user_data: any;
  addEditUserForm!: FormGroup;
  user_dto!: User;
  user_reg_data: any;
  edit_user_id: any;
  addEditUser: boolean = false;
  add_user!: boolean;
  edit_user!: boolean;
  popup_header!: string;
  signInFormValue: any = {};
  isDarkMode: boolean = false;
  paginated_users: User[] = [];
  current_page: number = 1;
  items_per_page: number = 10;
  Math = Math;
  showPassword = false;

  constructor(
    private formBuilder: FormBuilder,
    private adminService: AdminService,
  ) {}

  ngOnInit(): void {
    this.addEditUserForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      mobNumber: ['', [Validators.required]],
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
      address: ['', [Validators.required]],
      city: ['', [Validators.required]],
      zipCode: ['', [Validators.required]],
      gender: ['', [Validators.required]],
      agreetc: ['', [Validators.required]],
      role: ['', [Validators.required]],
    });
    this.getAllUser();
    this.fetchProductData();
  }

  getAllUser() {
    this.adminService.allUser().subscribe(
      (data) => {
        this.all_user_data = data;
        this.setPage(1);
      },
      (error) => {
        console.log('My error', error);
      }
    );
  }

  get rf() {
    return this.addEditUserForm.controls;
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  addUserPopup() {
    this.edit_user = false;
    this.add_user = true;
    this.popup_header = 'Add New User';
    this.addEditUserForm.reset();
  }

  addUser() {
    this.addEditUser = true;
    if (this.addEditUserForm.invalid) {
      alert('Error!! :-)\n\n' + JSON.stringify(this.addEditUserForm.value));
      return;
    }
    this.user_reg_data = this.addEditUserForm.value;
    this.user_dto = {
      id: this.user_reg_data.id,
      agreetc: this.user_reg_data.agreetc,
      email: this.user_reg_data.email,
      gender: this.user_reg_data.gender,
      address: this.user_reg_data.address,
      city: this.user_reg_data.city,
      zipCode: this.user_reg_data.zipCode,
      mobNumber: this.user_reg_data.mobNumber,
      name: this.user_reg_data.name,
      password: this.user_reg_data.password,
      role: this.user_reg_data.role,
    };
    this.adminService.addUser(this.user_dto).subscribe(
      (data) => {
        Swal.fire('User Add Successfully 😊!');
        this.addEditUserForm.reset();
        this.getAllUser();
        $('#addEditUserModal').modal('toggle');
      },
      (error) => {
        console.log('my wrong ', error);
      }
    );
  }

  editUserPopup(id: any) {
    this.edit_user = true;
    this.add_user = false;
    this.popup_header = 'Edit User';
    this.addEditUserForm.reset();
    this.adminService.singleuUser(id).subscribe(
      (data) => {
        this.single_user_data = data;
        console.log('Single Data', this.single_user_data);
        this.edit_user_id = data.id;

        this.addEditUserForm.setValue({
          name: this.single_user_data.name || '',
          mobNumber: this.single_user_data.mobNumber || '',
          email: this.single_user_data.email || '',
          password: this.single_user_data.password || '',
          gender: this.single_user_data.gender || '',
          address: this.single_user_data.address || '',
          city: this.single_user_data.city || '',
          zipCode: this.single_user_data.zipCode || '',
          agreetc: this.single_user_data.agreetc || '',
          role: this.single_user_data.role || '',
        });
      },
      (error) => {
        console.log('My error', error);
      }
    );
  }

  updateUser() {
    this.addEditUser = true;
    if (this.addEditUserForm.invalid) {
      alert('Error!! :-)\n\n' + JSON.stringify(this.addEditUserForm.value));
      return;
    }
    this.user_reg_data = this.addEditUserForm.value;
    this.user_dto = {
      id: this.user_reg_data,
      agreetc: this.user_reg_data.agreetc,
      email: this.user_reg_data.email,
      gender: this.user_reg_data.gender,
      address: this.user_reg_data.address,
      city: this.user_reg_data.city,
      zipCode: this.user_reg_data.zipCode,
      mobNumber: this.user_reg_data.mobNumber,
      name: this.user_reg_data.name,
      password: this.user_reg_data.password,
      role: this.user_reg_data.role,
    };
    this.adminService.editUser(this.edit_user_id, this.user_dto).subscribe(
      (data) => {
        Swal.fire('User Update Successfully 😊!');
        this.addEditUserForm.reset();
        this.getAllUser();
        $('#addEditUserModal').modal('toggle');
      },
      (error) => {
        console.log('my wrong ', error);
      }
    );
  }

  deleteUser(id: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this 🙄!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.adminService.deleteUser(id).subscribe((res) => {
          this.getAllUser();
        });
        Swal.fire({
          title: 'Deleted!',
          text: 'Your file has been deleted 😊!',
          icon: 'success',
        });
      }
    });
  }

  fetchProductData() {
    this.adminService.allUser().subscribe(
      (data) => {
        this.all_user_data = data;
        this.setPage(this.current_page);
      },
      (error) => {
        console.error('Error fetching products:', error);
      }
    );
  }

  setPage(page: number) {
    if (
      page < 1 ||
      page > Math.ceil(this.all_user_data.length / this.items_per_page)
    ) {
      return;
    }
    this.current_page = page;
    const start = (page - 1) * this.items_per_page;
    const end = start + this.items_per_page;
    this.paginated_users = this.all_user_data.slice(start, end);
  }
}
