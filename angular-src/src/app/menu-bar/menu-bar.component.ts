import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { User } from '../models/user.model';

@Component({
  selector: 'app-menu-bar',
  templateUrl: './menu-bar.component.html',
  styleUrls: ['./menu-bar.component.css']
})
export class MenuBarComponent implements OnInit {

  @Input() user: User;
  
  @Output() onUserLogin: EventEmitter<Boolean>;

  constructor() {
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
