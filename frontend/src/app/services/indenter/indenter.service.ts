import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class IndenterService {
  endpoint: string = environment.ms_nb_04_indenter.apiUrl;
  baseUrl: string = environment.ms_nb_04_indenter.baseUrl;
  apiBaseUrl: string = environment.ms_nb_04_indenter.apiBaseUrl;
  constructor(private http: HttpClient) { }
public myData:any;
private approvalStageMessage = new BehaviorSubject('');

// console.log();
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
  getData(){
    return this.approvalStageMessage.asObservable();

  }
  putData(data:any){
    this.approvalStageMessage.next(data);
    console.log(data);
  }
}