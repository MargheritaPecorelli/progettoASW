import { Component } from '@angular/core';
import { AuthenticationService, TokenPayload } from '../services/authentication/authentication.service';
import { Router } from '@angular/router';

@Component({
  templateUrl: './login.component.html'
})
export class LoginComponent {
  credentials: TokenPayload = {
    email: '',
    password: ''
  };

  constructor(private auth: AuthenticationService, private router: Router) {}

  login() {
    this.auth.postLogin(this.credentials).subscribe(() => {
      //this.router.navigateByUrl('/profile/' + this.credentials.email);
      this.router.navigateByUrl('/admin');
    }, (err) => {
      console.error(err);
    });
  }
}
