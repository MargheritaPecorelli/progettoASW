import { Component, OnInit, Input } from '@angular/core';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-user-management-list',
  templateUrl: './user-management-list.component.html',
  styleUrls: ['./user-management-list.component.css']
})
export class UserManagementListComponent implements OnInit {

  @Input() userList : User[];

  constructor() { 
  }

  ngOnInit() {
    console.log(" ---> userList : received users : " , this.userList);

  }

  deletedUser(user: User) {
    console.log("---> userList : updating user list after deletion");
    console.log("---> userList : ", user);
    this.userList = this.userList.filter(u => u.email !== user.email);
  }

}
