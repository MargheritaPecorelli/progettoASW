import { Component } from '@angular/core';
import { AuthenticationService, TokenPayload } from '../services/authentication/authentication.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  credentials: TokenPayload = {
    email: '',
    password: ''
  };

  loginForm: FormGroup;
  email: AbstractControl;
  password: AbstractControl;

  loginError: boolean = false;

  constructor(private auth: AuthenticationService, private router: Router, fb: FormBuilder) {

    this.loginForm = fb.group({
      'email' : ['', Validators.required],
      'password' : ['', Validators.required]
    });

    this.email = this.loginForm.controls['email'];
    this.password = this.loginForm.controls['password'];

  }

  onAlertClosing() {
    this.loginError = false;
  }

  onSubmit(data) {
    console.log("submitted login form");
    console.log("mail: ", data.email);
    console.log("password: ", data.password);

    if(data.email == '' || data.password == ''){
      this.loginError = true;
    } else {
      this.credentials.email = data.email;
      this.credentials.password = data.password;
      this.login();
    }


  }


  login() {
    this.auth.postLogin(this.credentials).subscribe(() => {
      //this.router.navigateByUrl('/profile/' + this.credentials.email);
      this.router.navigateByUrl('/admin');
    }, (err) => {
      this.loginError = true;
      console.error(err);
    });
  }
}
