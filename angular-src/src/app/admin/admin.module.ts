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
import { SensorsResolver } from '../resolvers/sensors.resolver';
import { LocationsResolver } from '../resolvers/locations.resolver';
import { MeasurementResolver } from '../resolvers/measurement.resolver';
import { UserManagementEditModalComponent } from './user-management-edit-modal/user-management-edit-modal.component';
import { UserManagementDeleteModalComponent } from './user-management-delete-modal/user-management-delete-modal.component'
import { BoxComponent } from './box/box.component';
import { BoxListComponent } from './box-list/box-list.component';
import { UserManagerComponent } from './user-manager/user-manager.component';
import { ChartManagerComponent } from './chart-manager/chart-manager.component';
import { SensorManagementListComponent } from './sensor-management-list/sensor-management-list.component';
import { SensorManagementComponent } from './sensor-management/sensor-management.component';
import { SensorManagementRowComponent } from './sensor-management-row/sensor-management-row.component';
import { SensorManagementDeleteModalComponent } from './sensor-management-delete-modal/sensor-management-delete-modal.component';
import { SensorManagementEditModalComponent } from './sensor-management-edit-modal/sensor-management-edit-modal.component';

export const adminRoute : Routes = [
  { path: 'admin', component: AdminComponent , canActivate: [AuthGuard]},
  // { path: 'admin/management', component: BoxComponent, data: {provaAncora : '../../assets/images/user.jpeg'}},
  { path: 'admin/management', component: BoxListComponent, data: {userImage : '../../assets/images/user.jpeg',
                                                                  sensorImage : '../../assets/images/sensors.jpg',
                                                                  chartImage : '../../assets/images/chart.jpg'}, canActivate: [AuthGuard]},
  { path: 'admin/management/users', component: UserManagementComponent, resolve: { users: UsersResolver}, canActivate: [AuthGuard]},
  { path: 'admin/management/sensors', component: SensorManagementComponent, resolve: { sensors: SensorsResolver, locations: LocationsResolver, measurements: MeasurementResolver}, canActivate: [AuthGuard]},
  { path: 'admin/management/charts', component: ChartManagerComponent, canActivate: [AuthGuard]}
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
    AuthenticationService,
    SensorsResolver,
    LocationsResolver
  ],

  declarations: [AdminComponent, UserManagementRowComponent, UserManagementListComponent, UserManagementComponent, UserManagementEditModalComponent, UserManagementDeleteModalComponent, BoxComponent, BoxListComponent, UserManagerComponent, ChartManagerComponent, SensorManagementListComponent, SensorManagementComponent, SensorManagementRowComponent, SensorManagementDeleteModalComponent, SensorManagementEditModalComponent]
  
})

export class AdminModule {}
