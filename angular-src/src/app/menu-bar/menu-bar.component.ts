import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { User } from '../models/user.model';
import { AuthenticationService } from '../services/authentication/authentication.service';

@Component({
  selector: 'app-menu-bar',
  templateUrl: './menu-bar.component.html',
  styleUrls: ['./menu-bar.component.css']
})
export class MenuBarComponent implements OnInit {

  @Input() user: User;
  
  @Output() onUserLogin: EventEmitter<Boolean>;

  constructor(public authService: AuthenticationService) {
     this.onUserLogin = new EventEmitter();
  }
   
  userLogout(): void {
    this.onUserLogin.emit(false);
  }

  userLogin(): void {
    this.onUserLogin.emit(true);
  }

  ngOnInit() {
  }

}
