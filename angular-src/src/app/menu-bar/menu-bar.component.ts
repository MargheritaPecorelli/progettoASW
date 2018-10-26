import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-menu-bar',
  templateUrl: './menu-bar.component.html',
  styleUrls: ['./menu-bar.component.css']
})
export class MenuBarComponent implements OnInit {

  loggedUSer : boolean;

  constructor() { 
    this.loggedUSer = false;
  }

  ngOnInit() {
  }

  isUserLogged() : boolean {
    return this.loggedUSer;
  }

  setUserLogged(logged: boolean) : void {
    this.loggedUSer = logged;
  }

}
