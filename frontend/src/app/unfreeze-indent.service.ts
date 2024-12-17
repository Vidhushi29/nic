import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UnfreezeIndentService {
  unfreezeIndent(requestBody: { search: { year: any; season: any; crop_code: any; state_code: any; }; }) {
    throw new Error('Method not implemented.');
  }
  // private apiUrl = 'http://seed.aeologic.in/ms-nb-001-master/api/';

  constructor(private http: HttpClient) {}

  // getYearOfIndent(filters: any): Observable<any> {
  //   const token = localStorage.getItem ('token');
  //   const headers = new HttpHeaders().set('Authorization', 'Bearer' + token);

  //   return this.http.post<any>(`${this.apiUrl}/get-year-of-indent-spa`, { search: filters }, { headers });
  // }
  
}

