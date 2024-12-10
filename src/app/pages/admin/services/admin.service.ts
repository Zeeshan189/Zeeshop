import { Injectable } from '@angular/core';
import { ApiService } from '../../core/service/api.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  public user_url = 'http://localhost:3000/user/';
  public product_url = 'http://localhost:3000/products/';
  // public all_user = 'http://localhost:3000/user';

  constructor(private apiService: ApiService) {}

  userDashboardData() {
    return this.apiService.get(this.user_url);
  }

  productDashboardData() {
    return this.apiService.get(this.product_url);
  }

  allUser(): Observable<any> {
    return this.apiService.get(this.user_url);
  }

  addUser(user_dto: any) {
    return this.apiService.post(this.user_url, user_dto);
  }

  // get data of individual user //
  singleuUser(id: any) {
    return this.apiService.get(this.user_url + id);
  }

  //update data of individual user //
  editUser(id: any, user_dto: any): Observable<any> {
    return this.apiService.put(this.user_url + id, user_dto);
  }

  deleteUser(id: any) {
    return this.apiService.delete(this.user_url + id);
  }

}
