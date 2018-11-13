import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { DataRetrieverService } from 'src/app/services/data-retriever.service';

@Component({
  selector: 'app-user-management-row',
  templateUrl: './user-management-row.component.html',
  styleUrls: ['./user-management-row.component.css']
})
export class UserManagementRowComponent implements OnInit {

  @Input() user: User;
  @Input() index: string;
  @Output() deletedUser: EventEmitter<User>;

  constructor(private dbRetrieverService: DataRetrieverService) { 
    this.deletedUser = new EventEmitter();
    
  }

  ngOnInit() {
    console.log(" ------> userRow : received user : " , this.user);
  }

  updateAccessLevel(selected: boolean) {
    console.log("User is admin : ", selected);
  }

  updateUser(updatedUser: User){
    console.log("------> userRow : Updating User : " , updatedUser);
    this.dbRetrieverService.deleteSpecificUser(this.user.email).subscribe(response => {
      var admin = updatedUser.admin ? 'true' : 'false';
      this.dbRetrieverService.postNewUserWithPsw(updatedUser.email, updatedUser.name, updatedUser.surname, admin, updatedUser.salt, updatedUser.hash).subscribe(res => {
        
      });
    });
    this.user = updatedUser;
  }

  deleteUser(u: User) {
    console.log("------> userRow : deleting User : " , u);
    this.dbRetrieverService.deleteSpecificUser(u.email).subscribe(response => {
      this.deletedUser.emit(u);
      this.user = undefined;
    });
    this.deletedUser.emit(u);
    this.user = undefined;
  }

}
