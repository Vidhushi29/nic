import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

export class ProductioncenterService {
  endpoint: string = environment.ms_nb_06_production_center.apiUrl;
  baseUrl: string = environment.ms_nb_06_production_center.baseUrl;
  apiBaseUrl: string = environment.ms_nb_06_production_center.apiBaseUrl;
  data: any;
  liftingData:any;
  generateSampleData:any;
  constructor(private http: HttpClient) { }
  private cropnameData = new BehaviorSubject('')
  private vareitynameData = new BehaviorSubject('')
  private expected_harvest_to_dat = new BehaviorSubject('');
  private expectedInspection = new BehaviorSubject('');
  

  getRequestCreatorNew(route: string): Observable<{}> {

    const currentUser = JSON.parse(localStorage.getItem('BHTCurrentUser'));
    const token = currentUser? currentUser.token:'';
    const header = new HttpHeaders();
    const otherHeader = header.append('Authorization', 'Bearer ' + token);

    return this.http.get<{}>(this.endpoint + route, { headers: otherHeader });
  }


  postRequestCreator<T>(route: string, DataRow: any = {},token: any = ''): Observable<any> {
    const currentUser = JSON.parse(localStorage.getItem('BHTCurrentUser'));
    token = currentUser? currentUser.token:'';
    const header = new HttpHeaders();
    const otherHeader = header.append('Authorization', 'Bearer ' + token);
    return this.http.post<T>(this.endpoint + route, DataRow, { headers: otherHeader });
    // return this.http.post<T>(this.endpoint + route, DataRow);
  }
  getData(){
    return this.cropnameData.asObservable();
  }
  putData(data:any){
    this.cropnameData.next(data)

  }
  getVarietData(){
    return this.vareitynameData.asObservable();
  }
  putVarietyData(data:any){
    this.cropnameData.next(data)
  }
  expected_harvest_to(data:any){    
    this.expected_harvest_to_dat.next(data)

  }
  getexpected_harvest_to(){
    return this.expected_harvest_to_dat.asObservable();
  }
  expected_investion_to(data:any){    
    this.expectedInspection.next(data)

  }
  getexpected_investion_to(){
    return this.expectedInspection.asObservable();
  }

}
