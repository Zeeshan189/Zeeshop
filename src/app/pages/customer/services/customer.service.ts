import { Injectable } from '@angular/core';
import { ApiService } from '../../core/service/api.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product, Order } from '../../core/Model/object.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class CustomerService {
  private CartItem: { [userId: string]: Product[] } = {};
  private single_poduct_id = new BehaviorSubject(null);
  currentProduct = this.single_poduct_id.asObservable();
  private userSessionSubject = new BehaviorSubject<string | null>(null);
  userSessionChanged = this.userSessionSubject.asObservable();

  public user_url = 'http://localhost:3000/user/';
  public product_url = 'http://localhost:3000/products/';
  public order_url = 'http://localhost:3000/orders/';

  private storagekey = 'CartItem';
  constructor(private apiService: ApiService, private http: HttpClient) {
    const storeditem = localStorage.getItem(this.storagekey);
    if (storeditem) {
      this.CartItem = JSON.parse(storeditem);
    }
  }

  updateUserSession(user_id: string | null) {
    this.userSessionSubject.next(user_id);
  }

  allProduct(): Observable<any> {
    return this.apiService.get(this.product_url);
  }

  addToCart(product_id: any, userId: string): number {
    if (!this.CartItem[userId]) {
      this.CartItem[userId] = [];
    }
    const existingItem = this.CartItem[userId].find(
      (item) => item.id === product_id.id
    );
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      product_id.quantity = 1;
      this.CartItem[userId].push(product_id);
    }

    localStorage.setItem(this.storagekey, JSON.stringify(this.CartItem));

    return existingItem ? existingItem.quantity : product_id.quantity;
  }

  getCartItemCount(userId: string): number {
    return this.CartItem[userId] ? this.CartItem[userId].length : 0;
  }

  getCartItem(userId: string): Product[] {
    return this.CartItem[userId] || [];
  }

  removeitem(product: Product, userId: string): void {
    if (!this.CartItem[userId]) return;
    const index = this.CartItem[userId].findIndex(
      (item) => item.id === product.id
    );
    if (index !== -1) {
      this.CartItem[userId].splice(index, 1);
      localStorage.setItem(this.storagekey, JSON.stringify(this.CartItem));
    }
  }
  
  individualProduct(id: any) {
    return this.apiService.get(this.product_url + id);
  }

  userDetail(id: any) {
    return this.apiService.get(this.user_url + id);
  }

  orderDashboardData(): Observable<any> {
    return this.apiService.get(this.order_url);
  }

  productDashboardData(): Observable<any> {
    return this.apiService.get(this.product_url);
  }

  placeOrder(order: Order): Observable<any> {
    return this.apiService.post(this.order_url, order);
  }

  clearCart(userId: string): void {
    if (this.CartItem[userId]) {
      this.CartItem[userId] = [];
      localStorage.setItem(this.storagekey, JSON.stringify(this.CartItem));
    }
  }
  
}
