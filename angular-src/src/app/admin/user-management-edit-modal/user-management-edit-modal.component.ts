import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user.model';


@Component({
  selector: 'app-user-management-edit-modal',
  templateUrl: './user-management-edit-modal.component.html',
  styleUrls: ['./user-management-edit-modal.component.css']
})
export class UserManagementEditModalComponent implements OnInit {

  @Input() user: User
  @Output() onModalSubmitted: EventEmitter<User>

  userForm: FormGroup;

  constructor(private fb: FormBuilder) { 
    this.onModalSubmitted = new EventEmitter();
  }

  ngOnInit() {

    console.log(" ------------> userEditModal : received user : " , this.user);
    console.log(" ------------> userEditModal : received user : ", `${this.user.name}`);


    this.userForm = this.fb.group ({
      'name': [`${this.user.name}`, Validators.required],
      'surname': [`${this.user.surname}`, Validators.required],
      'email': [`${this.user.email}`, Validators.required],
      'admin': [`${this.user.admin}`]

    });

    console.log(" ------------> userEditModal : received user after form build: " , this.user);

  }

  submitModal(value) {
    console.log("modal submitted ! saving changes");
    console.log(" ------------> userEditModal :" , value);
    this.user = value;
    this.onModalSubmitted.emit(this.user);
  }

}
