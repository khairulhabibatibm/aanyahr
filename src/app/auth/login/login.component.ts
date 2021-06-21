import { RegisterService } from './../../services/auth/register/register.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginService } from '../../services/auth/login/login.service';
import Swal from 'sweetalert2';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  isSignup: boolean = true
  disSubmit: boolean = false;
  submitText: string = "Login";
  error = "";
  httperror = "";
  id: string
  loader = true;
  httpvalidate = false;
  type: string = "password"
  
  constructor(private fb: FormBuilder, private register: RegisterService, private service: LoginService, private router: Router, private route: ActivatedRoute) {
    this.loginForm = this.fb.group({
      'username': ['', Validators.required],
      'password': ['', Validators.required],
      'company_code': ['', Validators.required]
    })
   }

  ngOnInit() {
    sessionStorage.clear();
    this.id = this.route.snapshot.paramMap.get('id');
    if(this.id === "" || this.id === null){
      this.loader = false
    }
    else{
      let obj = {
        id: this.route.snapshot.paramMap.get('id')
      }
      this.register.verifyUser(obj).subscribe(data => { 
        if(data.id === 0){
          Swal.fire("Failed!", "Email can't be verified!", "error");
        }
        else{
          Swal.fire("Email Verify!", "Email verified. You can now login!", "success");
        }
        this.loader = false
      },
      (error: HttpErrorResponse) => {
        console.log(error.error);
      })
    }
  }

  login() {
    this.disSubmit = true;
    this.submitText = "Loading ...";
    this.httperror = "";
    this.service.authenticateUser(this.loginForm.value).subscribe(logData => { 
      if(logData['id'] === "0"){
        this.httpvalidate = true;
        this.httperror = logData['type'];
        this.disSubmit = false;
        this.submitText = "Login";
      }
      else{
        this.service.saveToken(logData);
        if(logData['routing'] !== '/company-setup')
        {
          if(logData['is_pw_changed']){
            this.router.navigate([logData['routing']]);
            this.disSubmit = false;
            this.submitText = "Login";
          }
          else{
            const route = logData['routing'] + "/" + logData['id']
            this.router.navigate([route]);
            this.disSubmit = false;
            this.submitText = "Login";
          }
         
        }
        else{
          this.router.navigate([logData['routing']]);
          this.disSubmit = false;
          this.submitText = "Login";
        }
      }
    },
    (error:HttpErrorResponse) => {
      console.log(error.error);
      //-- for future error handling --//
      // if (error.error instanceof ErrorEvent) {
      //   // A client-side or network error occurred. Handle it accordingly.
      //   console.error('An error occurred:', error.error.message);
      // } else {
      //   // The backend returned an unsuccessful response code.
      //   // The response body may contain clues as to what went wrong.
      //   console.error(
      //     `Backend returned code ${error.status}, ` +
      //     `body was: ${error.error}`);
      // }
      this.httperror = "Can't connect on our system.."
      this.disSubmit = false;
      this.submitText = "Login";
    })
  }

  toggle() {
    if (this.type === "text") {
      this.type = "password";
    } else {
      this.type = "text"
    }
  }

  get validate() {
    let ret = false;
    if(this.loginForm.get('username')?.errors && this.loginForm.get('username')?.touched && this.loginForm.get('password')?.errors && this.loginForm.get('password')?.touched){
      ret= true;
      this.error = "Username and Password is required!";
    }
    else if(this.loginForm.get('username')?.errors && this.loginForm.get('username')?.touched){
      ret= true;
      this.error = "Username is required!";
    }
    else if(this.loginForm.get('password')?.errors && this.loginForm.get('password')?.touched){
      ret= true;
      this.error = "Password is required!";
    }
    else{
      this.error = "";
    }
    if(ret === true){
      this.httpvalidate = false;
      this.httperror = "";
    }
    else{
      if(this.httperror === ""){
        this.httpvalidate = false;
      }
      else{
        this.httpvalidate = true;
      }
    }
    return ret;
  }
}
