import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-user-management-delete-modal',
  templateUrl: './user-management-delete-modal.component.html',
  styleUrls: ['./user-management-delete-modal.component.css']
})
export class UserManagementDeleteModalComponent implements OnInit {

  @Input() user: User
  @Output() onModalSubmitted: EventEmitter<User>

  constructor() {
    this.onModalSubmitted = new EventEmitter();
    
   }

  ngOnInit() {
    console.log(" ------------> userDeleteModal : received user : " , this.user);
  }

  confirmDeletion() {
    console.log("Deletion confirmed ! saving changes");
    console.log("------------> userDeleteModal : Deleting user: ", this.user);
    this.onModalSubmitted.emit(this.user);
  }


}
