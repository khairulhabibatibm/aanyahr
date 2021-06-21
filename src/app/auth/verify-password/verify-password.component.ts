import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { UserManagementService } from '../../services/UserManagementService/userManagement.service';

@Component({
  selector: 'app-verify-password',
  templateUrl: './verify-password.component.html',
  styleUrls: ['./verify-password.component.css']
})
export class VerifyPasswordComponent implements OnInit {
  verifyForm: FormGroup
  type: string = "password"
  errUsername: boolean = false
  errPassword: boolean = false
  strError = ""

  constructor(private router: Router, private fb: FormBuilder, private userManagement: UserManagementService) { }

  ngOnInit() {
    this.verifyForm = this.fb.group({
      'username': '',
      'password': '',
    })

    this.userManagement.profileView(sessionStorage.getItem('u')).subscribe(data => {
      this.verifyForm.setValue({
        username: data[0].user_name,
        password: data[0].decrypted_user_hash,
      });
    },
      (error: HttpErrorResponse) => {
        console.log(error.error);
      })
  }

  toggle() {
    if (this.type === "text") {
      this.type = "password";
    } else {
      this.type = "text"
    }
  }

  validation() {
    let flag = true
    this.errUsername = false
    this.errPassword = false
    this.strError = ""
    if (this.verifyForm.get('username').value == "" || this.verifyForm.get('username').value === null) {
      flag = false
      this.errUsername = true
    }
    if (this.verifyForm.get('password').value === "" || this.verifyForm.get('password').value === null) {
      flag = false
      this.errPassword = true
    }
    else {
      let variations = {
        digits: /\d/.test(this.verifyForm.get('password').value),
        lower: /[a-z]/.test(this.verifyForm.get('password').value),
        upper: /[A-Z]/.test(this.verifyForm.get('password').value),
        nonWords: /\W/.test(this.verifyForm.get('password').value),
      }
      if (!variations.digits) {
        this.strError = "Password needs to have atleast one number!"
        flag = false
      }
      if (!variations.upper) {
        this.strError = "Password needs to have atleast one upper case letter!"
        flag = false
      }
      if (this.verifyForm.get('password').value.length < 8) {
        this.strError = "Password needs to have a minimum of eight characters!"
        flag = false
      }
    }
    return flag
  }

  onVerify(){
    if(this.validation()){
      Swal.fire({
        title: 'Are you sure?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes',
        showLoaderOnConfirm: true,
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire({
            title: 'Please Wait !',
            allowOutsideClick: false,
            onBeforeOpen: () => {
              Swal.showLoading()
              var obj = {
                employee_id: sessionStorage.getItem('u'),
                user_name: this.verifyForm.get('username').value,
                user_hash: this.verifyForm.get('password').value,
                created_by: sessionStorage.getItem('u'),
                series_code: sessionStorage.getItem('sc'),
              }
              this.userManagement.credentialU(obj).subscribe(data => {
                if (data === 0) {
                  Swal.fire("Failed!", "Transaction failed!", "error");
                }
                else {
                  Swal.fire("Ok!", "Credentials has been updated. Please relogin!", "success");
                  sessionStorage.removeItem('token');
                  if (!sessionStorage.getItem('token')) {
                    this.router.navigate(['login']);
                  }
                }
              },
                (error: HttpErrorResponse) => {
                  console.log(error.error);
                  Swal.fire("Failed!", "Transaction failed!", "error");
                });
            },
          });
        }
      })
    }
  }

  reLogin(){
    this.router.navigate(['login']);
  }

}
