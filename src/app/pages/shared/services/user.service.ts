import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../core/service/api.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  public user_url ="http://localhost:3000/user/";

  constructor(private http:HttpClient, private apiService:ApiService) { }

  //get individual data
  getUserData(id:any){
    return this.apiService.get(this.user_url+id);
  }
  //update data by user_id
  updateUserData(id:any, user_dto:any):Observable<any>{
    return this.apiService.put(this.user_url+id, user_dto);
  }
}
