import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes} from '@angular/router';
import { FormsModule } from '@angular/forms';

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
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './guards/auth.guard';
import { AdminMainComponent } from './admin-main/admin-main.component';
import { AuthenticationService } from './services/authentication/authentication.service';
import { ProfileComponent } from './profile/profile.component';

const route : Routes = [
  { path: '', component: HomepageComponent },
  { path: 'home', redirectTo: '', pathMatch: 'full' },
  { path: 'about', component: AboutComponent },
  { path: 'charts/:type/:id', component: ChartDetailsComponent, resolve: { chart: ChartResolver }},
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'profile/:mail', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'reserved', component: AdminMainComponent, canActivate: [AuthGuard] },
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
    AdminMainComponent,
    ProfileComponent 
  ],

  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(route),
    FormsModule
  ],

  providers: [
    ChartResolver,
    AuthGuard,
    AuthenticationService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
