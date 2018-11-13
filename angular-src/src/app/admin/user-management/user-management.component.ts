import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})

export class UserManagementComponent implements OnInit {

  userList: User[];

  constructor(private route: ActivatedRoute) { 
    this.userList = [];
  }

  ngOnInit() {
    this.userList = this.route.snapshot.data['users'];
    console.log(" ------------------> Received users data : " , this.userList);
  
  }

}
