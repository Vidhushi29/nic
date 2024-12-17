import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class IcarService {

  endpoint: string = environment.ms_nb_02_icar.apiUrl;
  baseUrl: string = environment.ms_nb_02_icar.baseUrl;
  apiBaseUrl: string = environment.ms_nb_02_icar.apiBaseUrl;
  constructor(private http: HttpClient) { }

  getRequestCreatorNew(route: string): Observable<{}> {
    const currentUser = JSON.parse(localStorage.getItem('BHTCurrentUser'));
    const token = currentUser? currentUser.token:'';
    const header = new HttpHeaders();
    const otherHeader = header.append('Authorization', 'Bearer ' + token);
    return this.http.get<{}>(this.endpoint + route, { headers: otherHeader });
  }

  postRequestCreator<T>(route: string, token: any = '', DataRow: any = {}): Observable<any> {
    const currentUser = JSON.parse(localStorage.getItem('BHTCurrentUser'));
    token = currentUser? currentUser.token:'';
    const header = new HttpHeaders();
    const otherHeader = header.append('Authorization', 'Bearer ' + token);
    return this.http.post<T>(this.endpoint + route, DataRow, { headers: otherHeader });
    // return this.http.post<T>(this.endpoint + route, DataRow);
  }
}
