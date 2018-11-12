import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule, Routes} from '@angular/router';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AuthGuard } from '../guards/auth.guard';
import { AuthenticationService } from '../services/authentication/authentication.service';

import { AdminComponent } from './admin.component';
import { AboutComponent } from '../about/about.component';
import { PageNotFoundComponent } from '../page-not-found/page-not-found.component';
import { UserManagementRowComponent } from './user-management-row/user-management-row.component';
import { UserManagementListComponent } from './user-management-list/user-management-list.component';
import { UserManagementComponent } from './user-management/user-management.component';
import { UsersResolver } from '../resolvers/users.resolver';
import { UserManagementEditModalComponent } from './user-management-edit-modal/user-management-edit-modal.component';
import { UserManagementDeleteModalComponent } from './user-management-delete-modal/user-management-delete-modal.component'

export const adminRoute : Routes = [
  { path: 'admin', component: AdminComponent , canActivate: [AuthGuard]},
  { path: 'test', component: AboutComponent, canActivate: [AuthGuard]},
  { path: 'users', component: UserManagementComponent, resolve: { users: UsersResolver}, canActivate: [AuthGuard]},
] ;

@NgModule({

  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(adminRoute)
  ], 

  providers: [
    UsersResolver,
    AuthGuard,
    AuthenticationService
  ],

  declarations: [AdminComponent, UserManagementRowComponent, UserManagementListComponent, UserManagementComponent, UserManagementEditModalComponent, UserManagementDeleteModalComponent]
  
})

export class AdminModule { }
