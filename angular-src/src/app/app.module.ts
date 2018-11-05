import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes} from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { MenuBarComponent } from './menu-bar/menu-bar.component';
import { GraphListComponent } from './graph-list/graph-list.component';
import { GraphRowComponent } from './graph-row/graph-row.component';
import { GraphHolderComponent } from './graph-holder/graph-holder.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AboutComponent } from './about/about.component';
import { HomepageComponent } from './homepage/homepage.component';
import { ChartDetailsComponent } from './chart-details/chart-details.component';
import { SideMenuComponent } from './side-menu/side-menu.component';
import { ChartResolver } from './resolvers/chart.resolver';

import { AuthGuard } from './guards/auth.guard';
import { AuthenticationService } from './services/authentication/authentication.service';

import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ProfileComponent } from './profile/profile.component';

import { AdminComponent } from './admin/admin.component';
import { AdminModule } from './admin/admin.module';
import { adminRoute } from './admin/admin.module';


const route : Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full'},
  { path: 'home', component: HomepageComponent  },
  { path: 'about', component: AboutComponent },
  { path: 'charts/:type/:id', component: ChartDetailsComponent, resolve: { data: ChartResolver }},
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'profile/:mail', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'admin', component: AdminComponent, children: adminRoute, canActivate: [AuthGuard] },
  { path: '**', component: PageNotFoundComponent}
]

@NgModule({
  declarations: [
    AppComponent,
    MenuBarComponent,
    GraphListComponent,
    GraphRowComponent,
    GraphHolderComponent,
    PageNotFoundComponent,
    AboutComponent,
    HomepageComponent,
    ChartDetailsComponent,
    SideMenuComponent,
    RegisterComponent,
    LoginComponent,
    ProfileComponent 
  ],

  imports: [
    BrowserModule,
    RouterModule.forRoot(route),
    AdminModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],

  providers: [
    ChartResolver,
    AuthGuard,
    AuthenticationService
  ],

  bootstrap: [AppComponent]
})
export class AppModule { }
