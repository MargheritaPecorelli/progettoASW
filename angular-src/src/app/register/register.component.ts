import { Component } from '@angular/core';
import { AuthenticationService, TokenPayload } from '../services/authentication/authentication.service';
import { Router } from '@angular/router';

@Component({
  templateUrl: './register.component.html'
})

export class RegisterComponent {
  credentials: TokenPayload = {
    email: '',
    name: '',
    password: ''
  };

  constructor(private auth: AuthenticationService, private router: Router) {}

  register() {
    this.auth.postRegister(this.credentials).subscribe(() => {
      console.log("User registered with mail : ", this.credentials.email)
      this.router.navigateByUrl('/profile/' + this.credentials.email);
    }, (err) => {
      console.error(err);
    });
  }
}
