import { Component, OnInit } from '@angular/core';
import {CookieService} from 'ngx-cookie-service';
import { Router, ActivatedRoute } from '@angular/router';
import { MasterService } from '../services/master/master.service';
import Swal from 'sweetalert2';
import { EncryptionService} from '../services/encryption.service';

@Component({
  selector: 'app-seednet-login',
  templateUrl: './seednet-login.component.html',
  styleUrls: ['./seednet-login.component.css']
})
export class SeednetLoginComponent implements OnInit {
  authToken:any;

  constructor(private router: Router, private route: ActivatedRoute,  private cookieService:CookieService, private master: MasterService,
    private encryptionService: EncryptionService,
    ) { 
      this.route.queryParamMap.subscribe((params: any) => this.authToken = params.params.token);  
    }

  ngOnInit(): void {
    // let token = this.cookieService.get('seednet_token');

    console.log("this.authToken", this.authToken)
    let token = this.encryptionService.decryption(decodeURIComponent(this.authToken))
    token = token.replace(/['"]+/g, '')
    console.log(token);

    console.log("tokentoken1111111111", token)
    this.cookieService.set('token', token);

    let href = this.router.url;
        console.log("hrefhrefhref",href, window.location.origin);
      this.master
        .loginRequest("validate-user", token)
        .subscribe((apiResponse: any) => {
          console.log("apiResponse", apiResponse)        

          if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code
            && apiResponse.EncryptedResponse.status_code == 200) {
              const data = apiResponse.EncryptedResponse.data;
              localStorage.setItem('BHTCurrentUser', JSON.stringify(data));
              // this.router.navigate(['events']);
              // this.currentUserSubject.next(user.EncryptedResponse.data);

              switch(data.user_type) { 
                case 'SD': { 
                  this.router.navigate(['dashboardSeed'])
                  break; 
                } 
                case 'ICAR': { 
                  this.router.navigate(['nodal-dashboard'])
                   break; 
                }
                case 'HICAR': { 
                  this.router.navigate(['nodal-dashboard'])
                   break; 
                }
                case 'IN': { 
                  this.router.navigate(['indentor-seed-dashboard'])
                  break; 
                } 
                case 'BR': { 
                  this.router.navigate(['breeder-dashboard'])
                  // this.router.navigate(['indent-breeder-seed-allocation-list'])
                   break; 
                }  case 'BPC': { 
                  this.router.navigate(['bsp-dashboard'])
                  break; 
                } 
               
                default: { 
                  this.router.navigate(['login'])
                   break; 
                } 
             } 
          }else{
            Swal.fire({
              title: '<p style="font-size:25px;">Invalid credentails, redirect to login page.</p>',
              icon: 'error',
              confirmButtonText:
                'OK',
            confirmButtonColor: '#E97E15'            
            }).then(result => {
              if (result.isConfirmed) {
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
                  // window.location.href = 'http://sathi.nic.in/ms014';
                
              }
            })
          }
        });
    }
}

