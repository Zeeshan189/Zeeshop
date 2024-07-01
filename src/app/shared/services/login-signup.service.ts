import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../core/service/api.service';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class LoginSignupService {
  [x: string]: any;

  public login_url = 'http://localhost:3000';
  public reg_url = 'http://localhost:3000';

  constructor(private http: HttpClient, private apiService: ApiService) {}

  authLogin(user_name: any, password: any): Observable<any> {
    return this.apiService
      .get(
        this.login_url + '/user?email=' + user_name + '&password=' + password
      )
      .pipe(
        tap((response) => {
          // Store response data in local storage
          localStorage.setItem('authLoginData', JSON.stringify(response));
        })
      );
  }

  checkDuplicateEmail(): Observable<any> {
    return this.http.get(`${this.reg_url}/user`);
  }

  userRegister(user_dto: any): Observable<any> {
    return this.apiService.post(this.reg_url + '/user', user_dto);
  }

  adminLogin(user_name: any, password: any): Observable<any> {
    return this.apiService
      .get(
        this.login_url +
          '/user?email=' +
          user_name +
          '&password=' +
          password +
          '&role=admin'
      )
      .pipe(
        tap((response) => {
          // Store response data in local storage
          localStorage.setItem('adminLoginData', JSON.stringify(response));
        })
      );
  }
}
