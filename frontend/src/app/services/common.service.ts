import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
// import { AuthenticationService } from '../_services';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
    private currentUser;
    private API_URL = environment.ms_nb_01_master.apiUrl;

  constructor(private _http: HttpClient,private router: Router) {}

    postRequestCreator(param, route): Observable<{}> {
        const currentUser = JSON.parse(localStorage.getItem('BHTCurrentUser'));
        const token = currentUser? currentUser.token:'';
        const header = new HttpHeaders();
        const otherHeader = header.append('Authorization', 'Bearer ' + token);
        return this._http.post<{}>(this.API_URL + '/' + route, param);
    }

    getRequestCreator(route): Observable<{}> {
      const currentUser = JSON.parse(localStorage.getItem('BHTCurrentUser'));
      const token = currentUser? currentUser.token:'';
      const header = new HttpHeaders();
      const otherHeader = header.append('Authorization', 'Bearer ' + token);
      return this._http.get<{}>(this.API_URL + '/' + route);
  }
}
