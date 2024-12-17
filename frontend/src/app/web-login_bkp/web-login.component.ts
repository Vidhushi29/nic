import { Component, OnInit } from '@angular/core';
import {CookieService} from 'ngx-cookie-service';
import { Router, ActivatedRoute } from '@angular/router';
import { MasterService } from '../services/master/master.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import {AuthenticationService} from "../services/authentication.service";
import {CommonService} from "../services/common.service";
import Swal from "sweetalert2";

@Component({
  selector: 'app-web-login',
  templateUrl: './web-login.component.html',
  styleUrls: ['./web-login.component.css']
})
export class WebLoginComponent implements OnInit {

  loginForm: FormGroup;
  returnUrl: string;
  submitted = false;
  loading = false;
  error = '';
  passwordShowToggle=false;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private cookieService:CookieService,
    private _commonService: CommonService,
    private authenticationService: AuthenticationService
  ) { }

  ngOnInit() {

    this.loginForm = this.formBuilder.group({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required])
    });
    // get return url from route parameters or default to '/'
    // this.returnUrl = '/login';
    //Production Server
    // window.location.href = 'https://seedtrace.gov.in/ms014/'

    //Staging(Demo) Server
    window.location.href = 'http://demo.seedtrace.nic.in/ms014/'

    // if (!localStorage.getItem('login')) {
    //   localStorage.setItem('login', 'no reload')
    //   location.reload()
    // } else {
    //   localStorage.removeItem('login')
    // }


  }

  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  signIn() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.authenticationService.login(this.f)
      .subscribe(
        data => {
          console.log('login page data : ');
          console.log(data);
          if (typeof data !== 'undefined' && data !== null && data !== '' && JSON.stringify(data) !== '{}') {
            if(data.token) {
              this.cookieService.set('token', data.token);
              this.router.navigate([this.returnUrl]);
            } else {
              this.authenticationService.logout();
              this.loading = false;
            }
          } else {
            this.loading = false;
            this.error = 'Email or Password Doesn\'t Exist!';
          }
        },
        error => this.handleError(error)
      );
  }

  handleError(errorData){
    console.log('error', errorData);
    this.error = errorData;
    this.loading = false;
  }
  togglePassword(){
    // alert('hiii')
    const togglePassword = document.querySelector('#togglePassword');
  const password = document.querySelector('#id_password');
  const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
    password.setAttribute('type', type);
    this.passwordShowToggle =!this.passwordShowToggle

//   togglePassword.addEventListener('click', function (e) {
//     // toggle the type attribute
    
//     // toggle the eye slash icon
//     this.classList.toggle('fa-eye-slash');
// });
  }

}
