import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes} from '@angular/router';

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

const route : Routes = [
  { path: '', component: HomepageComponent },
  { path: 'home', redirectTo: '', pathMatch: 'full' },
  { path: 'about', component: AboutComponent },
  { path: 'charts/:type/:id', component: ChartDetailsComponent },
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
    SideMenuComponent
  ],

  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(route),
  ],

  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
