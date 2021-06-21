import { RegisterService } from './../../services/auth/register/register.service';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  error = "";
  loader = true;
  disSubmit: boolean = false;
  submitText: string = "Sign Up";

  constructor(private fb: FormBuilder, private service: RegisterService, private router: Router) {
     this.registerForm = this.fb.group({
      'Username': ['', Validators.required],
      'email_address': ['', Validators.required],
      'Password': ['', Validators.required]
    })
   }

  ngOnInit() {
    this.loader = false;
  }

  register(){
    this.disSubmit = true;
    this.submitText = "Loading ...";
    this.service.registerUser(this.registerForm.value).subscribe(data => { 
      if(data.id === 0){
        Swal.fire("Failed!", data.description, "error");
      }
      else{
        this.router.navigate(['/login'])
        this.disSubmit = false;
        this.submitText = "Sign Up";
      }
    },
    (error: HttpErrorResponse) => {
      console.log(error.error);
    })
  }

  get validate() {
    let ret = false;
    if(this.registerForm.get('Username')?.errors && this.registerForm.get('Username')?.touched && this.registerForm.get('email_address')?.errors && this.registerForm.get('email_address')?.touched
    && this.registerForm.get('Password')?.errors && this.registerForm.get('Password')?.touched){
      ret= true;
      this.error = "Username, Password and Email Address is required!";
    }
    else if(this.registerForm.get('Username')?.errors && this.registerForm.get('Username')?.touched){
      ret= true;
      this.error = "Username is required!";
    }
    else if(this.registerForm.get('email_address')?.errors && this.registerForm.get('email_address')?.touched){
      ret= true;
      this.error = "Email Address is required!";
    }
    else if(this.registerForm.get('Password')?.errors && this.registerForm.get('Password')?.touched){
      ret= true;
      this.error = "Password is required!";
    }
    let variations = {
      digits: /\d/.test(this.registerForm.get('Password').value),
      lower: /[a-z]/.test(this.registerForm.get('Password').value),
      upper: /[A-Z]/.test(this.registerForm.get('Password').value),
      nonWords: /\W/.test(this.registerForm.get('Password').value),
    }
    if (!variations.digits) {
      this.error = "Password needs to have atleast one number!"
      ret= true;
    }
    if (!variations.upper) {
      this.error = "Password needs to have atleast one upper case letter!"
      ret= true;
    }
    if (this.registerForm.get('Password').value.length < 8) {
      this.error = "Password needs to have a minimum of eight characters!"
      ret= true;
    }
    else{
      this.error = "";
    }
    return ret;
  }

}
