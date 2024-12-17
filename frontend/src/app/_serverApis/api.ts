import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
  })
export class UserCreateApi{
  url:string= 'sathi.nic.in/ms016/userAuthentication/createUser';

  constructor (private http: HttpClient) { }

  createUserRequest(data) {
    const headers = new HttpHeaders()
        .set('cache-control', 'no-cache')
        .set('content-type', 'application/json')
        .set('postman-token', 'b408a67d-5f78-54fc-2fb7-00f6e9cefbd1');

    const body = {
      appKey: '645b4b64565465b64565464b5645b645b65b654',
      stateCode: data.stateCode,
      userid: data.user_id,
      password: data.password,
      name: data.name,
      role: data.role
    }

    return this.http.post(this.url, body, { headers: headers }).subscribe(res => res);
  }       
}

