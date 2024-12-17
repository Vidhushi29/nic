import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { User } from "../model/user";

@Injectable({
    providedIn: 'root'
})
export class AuthenticationService {
    private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;
    private API_URL = environment.ms_nb_01_master.apiUrl;
    Common_API_URL = environment.ms_nb_01_master.apiUrl;

    constructor(private _http: HttpClient, private router: Router) {
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('BHTCurrentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }

    login(userData) {
        console.log("window.location.origin", window.location.origin)

        const data = { user_id: userData.username.value, password: userData.password.value,state_code: userData.state_code && userData.state_code.value ? userData.state_code.value:null};
        return this._http.post<any>(this.API_URL + 'web-login', data)
            .pipe(map(user => {
                // login successful if there's a jwt token in the response
                if (user && user.EncryptedResponse.data.token) {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    // console.log(user.result);
                    
                    localStorage.setItem('state_code' ,userData.state_code.value);
                    localStorage.setItem('BHTCurrentUser', JSON.stringify(user.EncryptedResponse.data));
                    // this.router.navigate(['events']);
                    this.currentUserSubject.next(user.EncryptedResponse.data);
                }
                return user.EncryptedResponse.data;
            }));
    }

    verifyEmail(userData) {

        const data = { email: userData.username.value, mode: userData.mode.value, device_id: null };

        return this._http.post<any>(this.API_URL + '/verify-user-email', data)
            .pipe(map(user => {
                // login successful if there's a jwt token in the response
                // if (user && user.status == 'success') {
                //     alert('We have e-mailed your password reset link!');
                // }
                return user;
            }));
    }

    resetPassword(userData, token) {

        const data = { token: token, email: userData.username.value, password: userData.password.value, password_confirmation: userData.confirm_password.value };

        return this._http.post<any>(this.API_URL + '/password/reset', data)
            .pipe(map(user => {
                // login successful if there's a jwt token in the response
                // if (user && user.status == 'success') {
                //     alert('We have e-mailed your password reset link!');
                // }
                return user;
            }));
    }

    logout() {
        // remove user from local storage to log user out
        console.log('logout');
        localStorage.removeItem('BHTCurrentUser');
        // return;
        // this.router.navigate(['web-login']);
        // window.location.href = '/web-login';
        console.log("window.location.origin", window.location.origin)
        switch(window.location.origin) { 
            case 'https://seedtrace.gov.in': { 
              window.location.href = 'https://seedtrace.gov.in/ms014/login?stateCode=CENTRAL';
              break; 
            }
            
            default: { 
              window.location.href = window.location.origin;
              break; 
            }
          } 
        // window.location.href = 'https://seedtrace.gov.in/ms014';
        this.currentUserSubject.next(null);
    }
}
