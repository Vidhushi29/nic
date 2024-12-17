import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, ValidatorFn, AbstractControl, Validators } from '@angular/forms';
import { SeedServiceService } from '../services/seed-service.service';
import Swal from 'sweetalert2';
import { ConfirmAccountNumberValidator } from '../_helpers/utility';
import { Router } from '@angular/router';
import { MasterService } from '../services/master/master.service';
@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
  ngForm!: FormGroup;
  checkEmailError: string;
  repassword;
  newpassword;
  password;
  submitted = false;
  passwordShowToggle = false;

  user = {
    newpassword: '',
    repassword: ''
  };
  @ViewChild('form', { static: true }) ngForms: NgForm;
  newPassword: any;
  newRePassword: any;
  conFirmPasswordError: string;
  passwordnewShowToggle = false;
  passwordreenterShowToggle: boolean;
  userId: any;
  is_change_password: any;

  onSubmit(data: any) {
    if (this.ngForm.invalid) {
      return;
    }
    console.warn(data)
    this.submitted = true;
  
    this.checkEmail(data)
  }



  constructor(private fb: FormBuilder,
    private seedService: SeedServiceService,
    private route: Router,
    private masterService: MasterService) { this.createEnrollForm() }

  createEnrollForm() {
    this.ngForm = this.fb.group({
      // useremail: ['', [Validators.required, Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[A-Za-z]{2,4}$")]],
      password: ['', [Validators.required]],
      newpassword: ['',
        Validators.compose([
          Validators.required,
          Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*#?&]{8,}$/)
          //  Validators.minLength(6),
          // Validators.pattern('/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/')
          // Validators.required,
          // Validators.pattern("[0-9]{2}-[0-9]{2}-[0-9]{4}")
        ])
      ],
      //   Validators.compose([
      //     Validators.required, Validators.minLength(6),Validators.pattern('/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-])/')]
      //   ])
      // ],

      repassword: ['',
        [Validators.required, 
          Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*#?&]{8,}$/),
          // Validators.minLength(6),
          // Validators.pattern('/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-])/')
        ]
      ],
    },
      {
        validator: ConfirmAccountNumberValidator("newpassword", "repassword")
      }

    );
    // this.ngForm.controls['useremail'].valueChanges.subscribe(newValue => {
    //   // this.getCropCode(newValue);
    //   if (newValue) {
    //     this.checkEmailError = ''
    //   }

    // });
  }

  ngOnInit(): void {
    const localData = localStorage.getItem('BHTCurrentUser');
    const data = JSON.parse(localData);
    let is_change_password= data.is_change_password;
    this.is_change_password=is_change_password;
  }

  checkEmail(item: any) {
    const localData = localStorage.getItem('BHTCurrentUser');
    const data = JSON.parse(localData);
    // if (item.useremail != data.email_id) {
    //   this.checkEmailError = 'Email is not Correct';
    //   return;

    // } else {
    // const param = {
    //   search: {
    //     // email_id: item.useremail,
    //     password: item.password,
    //     id: data.id
    //   }
    // }
    // this.seedService.postRequestCreator('check-email_id', null, param).subscribe(data => {
    //   if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && parseInt(data.EncryptedResponse.status_code) === 200) {
    //     let checkResponse = data && data.EncryptedResponse && data.EncryptedResponse.data && data.EncryptedResponse.data && data.EncryptedResponse.data && data.EncryptedResponse.data.emailAlreadyRegistered
    //     if (!checkResponse) {
    //       Swal.fire({
    //         toast: true,
    //         icon: "error",
    //         title: "Email and password does not match",
    //         position: "center",
    //         showConfirmButton: false,
    //         showCancelButton: false,
    //         timer: 3000
    //       })
    //       return;
    //     }
    //     else {
    //       if (this.ngForm.invalid) {
    //         return;
    //       }
    //       else {
    //         const localData = localStorage.getItem('BHTCurrentUser');
    //         const data = JSON.parse(localData);
    //         console.log(data)
    //         const param = {
    //           search: {
    //             password: this.ngForm.controls['newpassword'].value,
    //             email_id: this.ngForm.controls['useremail'].value,
    //             currentpassword: this.ngForm.controls['password'].value,
    //             display_name: data.name
    //           }
    //         }

    //         this.masterService.postRequestCreator('common/updatePassword', null, param).subscribe((apiResponse: any) => {
    //           if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code == 200) {
    //             this.seedService.postRequestCreator('update_password/' + data.id, null, param).subscribe(data => {
    //               console.log(data)
    //               if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && parseInt(data.EncryptedResponse.status_code) === 200) {
    //                 Swal.fire({
    //                   toast: true,
    //                   icon: "success",
    //                   title: "Password Change Successfully",
    //                   position: "center",
    //                   showConfirmButton: false,
    //                   showCancelButton: false,
    //                   timer: 3000
    //                 }).then(x => {
    //                   this.route.navigate(['/dashboardSeed']);
    //                 })
    //               }
    //               else {
    //                 Swal.fire({
    //                   toast: true,
    //                   icon: "error",
    //                   title: "something went wrong",
    //                   position: "center",
    //                   showConfirmButton: false,
    //                   showCancelButton: false,
    //                   timer: 3000
    //                 })
    //               }
    //             })
    //           } else {
    //             Swal.fire({
    //               toast: true,
    //               icon: "error",
    //               title: "something went wrong",
    //               position: "center",
    //               showConfirmButton: false,
    //               showCancelButton: false,
    //               timer: 3000
    //             })
    //           }

    //         })


    //       }
    //     }
    //   }
    //   else {
    //     Swal.fire({
    //       toast: true,
    //       icon: "error",
    //       title: "Something went wrong",
    //       position: "center",
    //       showConfirmButton: false,
    //       showCancelButton: false,
    //       timer: 3000
    //     })

    //   }
    // })


    // }
    if (this.ngForm.invalid) {
      return;
    }
    else {
      const localData = localStorage.getItem('BHTCurrentUser');
      const data = JSON.parse(localData);
      console.log(data.email_id)
      const param = {
        search: {
          password: this.ngForm.controls['newpassword'].value,
          email_id: data && data.email_id ? data.email_id : '',
          currentpassword: this.ngForm.controls['password'].value,
          display_name: data.name
        }
      }


      this.masterService.postRequestCreator('common/updatePassword', null, param).subscribe((apiResponse: any) => {
        console.log('apiResponseapiResponse', apiResponse.EncryptedResponse.status_code)
        if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code == 200) {
          this.seedService.postRequestCreator('update_password/' + data.id, null, param).subscribe(res => {
            console.log(res, 'datadatadatadata')
            if (res && res.EncryptedResponse && res.EncryptedResponse.status_code == 200) {
              Swal.fire({

                title: '<p style="font-size:25px;">Password Change Successfully.</p>',
                icon: 'success',
                confirmButtonText:
                  'OK',
                confirmButtonColor: '#E97E15'
              }).then(x => {
                let data = localStorage.getItem('BHTCurrentUser')
                let localData = JSON.parse(data)
                localData.is_change_password = true;
                console.log(localData, 'localData')
                // let setlocalData =  
                localStorage.setItem('BHTCurrentUser', JSON.stringify(localData))
                // this.route.navigate(['/dashboardSeed']);
                this.redirect()
              })
            }
            else {
              Swal.fire({
                title: 'Oops',
                text: '<p style="font-size:25px;">Something Went Wrong.</p>',
                icon: 'error',
                confirmButtonText:
                  'OK',
                confirmButtonColor: '#E97E15'
              })
            }
          })
        } else {
          Swal.fire({
            title: 'Oops',
            text: '<p style="font-size:25px;">Something Went Wrong.</p>',
            icon: 'error',
            confirmButtonText:
              'OK',
            confirmButtonColor: '#E97E15'
          })
        }

      })


    }


  }
  onFormValueChange(item) {
    this.checkEmailError = '';
  }

  onFormPasswordValueChange(pass) {
    this.conFirmPasswordError = ''
    this.newPassword = pass
    if (this.newPassword != this.newRePassword) {
      this.conFirmPasswordError = 'Password does not match'
    }
    else {
      this.conFirmPasswordError = ''
    }
  }
  onFormRePasswordValueChange(repassword) {
    this.conFirmPasswordError = ''
    this.newRePassword = repassword;
    if (this.newPassword != this.newRePassword) {
      this.conFirmPasswordError = 'Password does not match'
    }
    else {
      this.conFirmPasswordError = ''
    }

  }
  togglePassword() {
    // alert('hiii')
    const togglePassword = document.querySelector('#togglePassword');
    const password = document.querySelector('#current_password');
    const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
    password.setAttribute('type', type);
    this.passwordShowToggle = !this.passwordShowToggle
  }
  togglenewPassword(inputid, iconid) {
    const togglePassword = document.querySelector(`#${inputid}`);
    const password = document.querySelector(`#${iconid}`);
    const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
    password.setAttribute('type', type);
    if (inputid == 'toggleNewPassword') {

      this.passwordnewShowToggle = !this.passwordnewShowToggle
    }
    if (inputid == 'togglereenterPassword') {

      this.passwordreenterShowToggle = !this.passwordreenterShowToggle
    }

  }
  redirect() {
    let user = localStorage.getItem('BHTCurrentUser')
    let user_id = JSON.parse(user)
    if ((user_id.user_type.toUpperCase()) == 'SD') {
      this.route.navigate(['/dashboardSeedSecond']).then(() => {
        window.location.reload();
      });
      // location.reload()
    }

    if ((user_id.user_type.toUpperCase()) == 'BPC') {
      this.route.navigateByUrl('/bsp-dashboard-second').then(() => {
        window.location.reload();
      });
    }
    if ((user_id.user_type.toUpperCase()) == 'BR') {
      this.route.navigateByUrl('/breeder-dashboard').then(() => {
        window.location.reload();
      });
    }
    if ((user_id.user_type.toUpperCase()) == 'nodal-dashboard') {
      this.route.navigateByUrl('/breeder-dashboard').then(() => {
        window.location.reload();
      });
    }
    // IN
    if ((user_id.user_type.toUpperCase()) == 'IN') {
      this.route.navigateByUrl('/indentor-seed-dashboard').then(() => {
        window.location.reload();
      });
    }
    if ((user_id.user_type.toUpperCase()) == 'ICAR') {
      this.route.navigateByUrl('/nodal-dasboard-seconds').then(() => {
        window.location.reload();
      });
    }
    if ((user_id.user_type.toUpperCase()) == 'HICAR') {
      this.route.navigateByUrl('/nodal-dasboard-seconds').then(() => {
        window.location.reload();
      });
    }
    if ((user_id.user_type.toUpperCase()) == 'SPP') {
      this.route.navigateByUrl('/spp-dashboard').then(() => {
        window.location.reload();
      });
    }

  }
}
