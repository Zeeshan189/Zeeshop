import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AdminService } from '../services/admin.service';
import { User } from '../../core/Model/object.model';
declare var $: any;

@Component({
  selector: 'app-user-crud',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-crud.component.html',
  styleUrl: './user-crud.component.css',
})
export class UserCrudComponent implements OnInit {
  all_user_data: any;
  single_user_data: any;
  addEditUserForm!: FormGroup;
  user_dto!: User;
  user_reg_data: any;
  edit_user_id: any;
  upload_file_name!: string;
  addEditUser: boolean = false;
  add_user: boolean = false;
  edit_user: boolean = false;
  popup_header!: string;
  signInFormValue: any = {};
  isDarkMode: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private adminService: AdminService
  ) {}

  ngOnInit(): void {
    this.getAllUser();
    this.addEditUserForm = this.formBuilder.group({
      name: ['', Validators.required],
      mobNumber: ['', Validators.required],
      email: ['', [Validators.required]],
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

  getAllUser() {
    this.adminService.allUser().subscribe(data => {
        this.all_user_data = data;
      },
      (error) => {
        console.log('My error', error);
      }
    );
  }

  get rf() {
    return this.addEditUserForm.controls;
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
      uploadPhoto: this.addEditUserForm.value.uploadPhoto,
      role: this.user_reg_data.role,
    };
    this.adminService.addUser(this.user_dto).subscribe(
      (data) => {
        this.addEditUserForm.reset();
        this.getAllUser();
        $('#addEditUserModal').modal('toggle');
      },
      (error) => {
        console.log('my wrong ', error);
      }
    );
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      this.addEditUserForm.patchValue({
        uploadPhoto: reader.result?.toString().split(',')[1]
      });
    };
    reader.readAsDataURL(file);
  }

  editUserPopup(user_id: any) {
    this.edit_user_id = user_id;
    this.edit_user = true;
    this.add_user = false;
    this.popup_header = 'Edit User';
    this.adminService.singleuUser(user_id).subscribe(
      (data) => {
        this.single_user_data = data;
        if (this.single_user_data.uploadPhoto.startsWith('data:image')) {
          this.upload_file_name = this.single_user_data.uploadPhoto.split(',')[1];
        }
        this.addEditUserForm.setValue({
          name: this.single_user_data.name,
          mobNumber: this.single_user_data.mobNumber,
          email: this.single_user_data.email,
          password: this.single_user_data.password,
          gender: this.single_user_data.gender,
          addLine1: this.single_user_data.address.addLine1,
          city: this.single_user_data.address.city,
          state: this.single_user_data.address.state,
          zipCode: this.single_user_data.address.zipCode,
          uploadPhoto: this.upload_file_name || '',
          agreetc: this.single_user_data.agreetc,
          role: this.single_user_data.role,
        });
      },
      (error) => {
        console.log('My error', error);
      }
    );
  }

  updateUser() {
    if (this.addEditUserForm.invalid) {
      alert('Error!! :-)\n\n' + JSON.stringify(this.addEditUserForm.value));
      return;
    }
    this.user_reg_data = this.addEditUserForm.value;
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
      uploadPhoto: this.addEditUserForm.value.uploadPhoto,
      role: this.user_reg_data.role,
    };
    this.adminService.editUser(this.edit_user_id, this.user_dto).subscribe(
      (data) => {
        alert('User Update Successfully')
        this.addEditUserForm.reset();
        this.getAllUser();
        $('#addEditUserModal').modal('toggle');
      },
      (error) => {
        console.log('my wrong ', error);
      }
    );
  }

  deleteUser(user_id:any){
    this.adminService.deleteUser(user_id).subscribe(data=>{
      this.getAllUser();
    }, error =>{
      console.log("My error", error)
    })
  }
  
}