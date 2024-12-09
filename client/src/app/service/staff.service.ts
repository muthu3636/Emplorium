import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {RegisterReq} from '../model/register-req';
import {ResponseBase} from '../model/response-base';
import {LoginRegisterResponse} from '../model/login-register-response';
import {log} from '@angular-devkit/build-angular/src/builders/ssr-dev-server';
import {Staff} from '../model/staff';

@Injectable({
  providedIn: 'root'
})
export class StaffService {

  API_BASE_URL = 'http://localhost:8080/staff/'

  constructor(private http:HttpClient) {}

  registerStaff(registerReq:RegisterReq){
      return this.http.post<LoginRegisterResponse>(this.API_BASE_URL+'add',registerReq);
  }

  updateStaff(staffId:string, staffDetails:RegisterReq){
    let url = `${this.API_BASE_URL}update`;
    let username = localStorage.getItem('username');
    let pass = localStorage.getItem('password')
    const headerVals = new HttpHeaders()
      .set('Authorization','Basic ' + btoa(username+':'+pass))
      .set('Accept','application/json');
    return this.http.put<ResponseBase>(url,staffDetails,{params:{staffId:staffId},headers:headerVals});
  }

  deleteStaff(staffId:string){
    let url = `${this.API_BASE_URL}del`;
    let username = localStorage.getItem('username');
    let pass = localStorage.getItem('password')
    const headerVals = new HttpHeaders()
      .set('Authorization','Basic ' + btoa(username+':'+pass))
      .set('Accept','application/json');
    return this.http.delete<ResponseBase>(url,{params: {staffId:staffId},headers:headerVals});
  }

  loginStaff(loginReq:RegisterReq){
    return this.http.post<LoginRegisterResponse>(this.API_BASE_URL+'login',loginReq);
  }

  getAllStaff() {
    let url = `${this.API_BASE_URL}all`;
    let username = localStorage.getItem('username');
    let pass = localStorage.getItem('password')
    const headerVals = new HttpHeaders()
      .set('Authorization','Basic ' + btoa(username+':'+pass))
      .set('Accept','application/json');
    return this.http.get<Staff[]>(url,{headers:headerVals});
  }



}
