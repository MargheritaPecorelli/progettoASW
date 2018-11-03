import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule, Routes} from '@angular/router';

import { AdminComponent } from './admin.component';
import { AboutComponent } from '../about/about.component';
import { PageNotFoundComponent } from '../page-not-found/page-not-found.component';

export const adminRoute : Routes = [
  { path: 'admin', component: AdminComponent },
  { path: 'test', component: AboutComponent}
] ;

@NgModule({

  imports: [
    CommonModule,
    RouterModule.forChild(adminRoute)
  ], 

  declarations: [AdminComponent]
  
})

export class AdminModule { }
