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
import Swal from 'sweetalert2';
import { DemoNgZorroAntdModule } from '../../ng-zorro-antd.module';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DemoNgZorroAntdModule],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css',
})
export class ProductComponent implements OnInit {
  all_product_data: any[] = [];
  paginated_products: Product[] = [];
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
  current_page: number = 1;
  items_per_page: number = 10;
  Math = Math;

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
    this.fetchProductData();
  }

  get rf() {
    return this.addEditProductDForm.controls;
  }

  getAllProduct() {
    this.productService.allProduct().subscribe((data) => {
      this.all_product_data = data;
    });
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
        Swal.fire('Product Add Successfully 😊!');
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
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.upload_file_name = reader.result?.toString().split(',')[1];

        this.addEditProductDForm.patchValue({
          uploadPhoto: this.upload_file_name,
        });
      };
      reader.readAsDataURL(file);
    }
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
          Swal.fire('Product Update Successfully 😊!');
          this.addEditProductDForm.reset();
          this.getAllProduct();
        },
        (error) => {
          console.log('my error', error);
        }
      );
  }

  deleteProduct(id: any) {
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
        this.productService.deleteProduct(id).subscribe((res) => {
          this.getAllProduct();
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
    this.productService.allProduct().subscribe(
      (data) => {
        this.all_product_data = data;
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
      page > Math.ceil(this.all_product_data.length / this.items_per_page)
    ) {
      return;
    }
    this.current_page = page;
    const start = (page - 1) * this.items_per_page;
    const end = start + this.items_per_page;
    this.paginated_products = this.all_product_data.slice(start, end);
  }
}
