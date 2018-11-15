import { Component } from '@angular/core';
import { AuthenticationService, TokenPayload } from '../services/authentication/authentication.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';

@Component({
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent {
  credentials: TokenPayload = {
    email: '',
    name: '',
    surname: '',
    password: '',
    admin: false
  };

  registrationForm: FormGroup;
  name: AbstractControl;
  surname: AbstractControl;
  email: AbstractControl;
  password: AbstractControl;

  constructor(private auth: AuthenticationService, private router: Router, fb: FormBuilder) {

    this.registrationForm = fb.group({
      'name' : ['', Validators.required],
      'surname' : ['', Validators.required],
      'email' : ['', Validators.required],
      'password' : ['', Validators.required]
    });

    this.name = this.registrationForm.controls['name'];
    this.surname = this.registrationForm.controls['surname'];
    this.email = this.registrationForm.controls['email'];
    this.password = this.registrationForm.controls['password'];

  }

  onSubmit(data) {
    console.log("submitted form");
    console.log("name: ", data.name);
    console.log("surname: ", data.surname);
    console.log("mail: ", data.email);
    console.log("password: ", data.password);

    this.credentials.name = data.name;
    this.credentials.surname = data.surname;
    this.credentials.email = data.email;
    this.credentials.password = data.password;

    this.register();
  }

  register() {
    this.auth.postRegister(this.credentials).subscribe(() => {
      console.log("User registered with mail : ", this.credentials.email)
      this.router.navigateByUrl('/');
    }, (err) => {
      console.error(err);
    });
  }
}
