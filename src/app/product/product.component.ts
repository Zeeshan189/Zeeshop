import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Product } from '../core/Model/object.model';
import { ProductService } from '../shared/services/product.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css',
})
export class ProductComponent implements OnInit {
  all_product_data: any;
  addEditProductDForm!: FormGroup;
  addEditProduct: boolean = false;
  popup_header!: string;
  add_prouct!: boolean;
  edit_prouct!: boolean;
  prouct_data: any;
  single_product_data: any;
  upload_file_name!: any;
  product_dto!: Product;
  edit_product_id: any;
  isDarkMode: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.addEditProductDForm = this.fb.group({
      name: ['', Validators.required],
      uploadPhoto: ['', Validators.required],
      productDesc: ['', Validators.required],
      mrp: ['', Validators.required],
      dp: ['', Validators.required],
      status: ['', Validators.required],
    });
    this.getAllProduct();
  }

  get rf() {
    return this.addEditProductDForm.controls;
  }

  getAllProduct() {
    this.productService.allProduct().subscribe(
      (data) => {
        this.all_product_data = data;
        console.log('My All product', this.all_product_data);
      },
      (error) => {
        console.log('Somthing went wrong ', error);
      }
    );
  }

  addProductPopup() {
    this.add_prouct = true;
    this.edit_prouct = false;
    this.popup_header = 'Add new Product';
    this.addEditProductDForm.reset();
  }

  addNewProduct() {
    this.addEditProduct = true;
    if (this.addEditProductDForm.invalid) {
      alert('Error!! :-)\n\n' + JSON.stringify(this.addEditProductDForm.value));
      return;
    }
    this.prouct_data = this.addEditProductDForm.value;
    this.product_dto = {
      id: this.prouct_data.id,
      name: this.prouct_data.name,
      uploadPhoto: this.addEditProductDForm.value.uploadPhoto,
      productDesc: this.prouct_data.productDesc,
      mrp: this.prouct_data.mrp,
      dp: this.prouct_data.dp,
      totalPrice: this.prouct_data.totalPrice,
      quantity: this.prouct_data.quantity,
      status: this.prouct_data.status,
    };
    this.productService.addNewProduct(this.product_dto).subscribe(
      (data) => {
        this.addEditProductDForm.reset();
        this.getAllProduct();
      },
      (error) => {
        console.log('my error', error);
      }
    );
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      this.addEditProductDForm.patchValue({
        uploadPhoto: reader.result?.toString().split(',')[1],
      });
      this.upload_file_name = reader.result?.toString().split(',')[1];
    };
    reader.readAsDataURL(file);
  }

  editProductPopup(id: any) {
    this.add_prouct = false;
    this.edit_prouct = true;
    this.popup_header = 'Edit Product';
    this.addEditProductDForm.reset();
    this.productService.singleProduct(id).subscribe((data) => {
      this.single_product_data = data;
      console.log('Single Data', this.single_product_data);
      this.edit_product_id = data.id;
      if (this.single_product_data.uploadPhoto.startsWith('data:image')) {
        this.upload_file_name =
          this.single_product_data.uploadPhoto.split(',')[1];
      } else {
        this.upload_file_name = this.single_product_data.uploadPhoto;
      }
      this.addEditProductDForm.setValue({
        name: this.single_product_data.name,
        productDesc: this.single_product_data.productDesc,
        mrp: this.single_product_data.mrp,
        dp: this.single_product_data.dp,
        status: this.single_product_data.status,
        uploadPhoto: this.upload_file_name || '',
      });
    });
  }

  updateProduct() {
    this.addEditProduct = true;
    if (this.addEditProductDForm.invalid) {
      alert('Error!! :-)\n\n' + JSON.stringify(this.addEditProductDForm.value));
      return;
    }

    this.prouct_data = this.addEditProductDForm.value;
    this.product_dto = {
      id: this.edit_product_id,
      name: this.prouct_data.name,
      uploadPhoto: this.prouct_data.uploadPhoto,
      productDesc: this.prouct_data.productDesc,
      mrp: this.prouct_data.mrp,
      dp: this.prouct_data.dp,
      totalPrice: this.prouct_data.totalPrice,
      quantity: this.prouct_data.quantity,
      status: this.prouct_data.status,
    };
    this.productService
      .updateProduct(this.edit_product_id, this.product_dto)
      .subscribe(
        (data) => {
          alert('Product Update Successfully!!');
          this.addEditProductDForm.reset();
          this.getAllProduct();
        },
        (error) => {
          console.log('my error', error);
        }
      );
  }

  deleteProduct(id: any) {
    let conf = confirm('Do you want to delete this product');
    if (conf) {
      this.productService.deleteProduct(id).subscribe(
        (data) => {
          alert('Product Delete successfully');
          this.getAllProduct();
        },
        (err) => {
          console.log(err);
        }
      );
    } else {
      alert('You pressed cancel !');
    }
  }
}
