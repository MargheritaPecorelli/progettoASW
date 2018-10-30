import { Component, OnInit } from '@angular/core';
import { User } from './models/user.model';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit{

  //title = 'angular-src';

  user : User; 
  

  constructor() {
    this.user = new User();
   
  }

  setLogin(login: boolean) : void {
    this.user.setUserLogged(login);
    if (login)
      console.log("User has logged in");
    else 
      console.log("User has logged out");
  }

  ngOnInit() {
  }

}
