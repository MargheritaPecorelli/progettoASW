import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { MenuBarComponent } from './menu-bar/menu-bar.component';
import { GraphListComponent } from './graph-list/graph-list.component';
import { GraphRowComponent } from './graph-row/graph-row.component';
import { GraphHolderComponent } from './graph-holder/graph-holder.component';


@NgModule({
  declarations: [
    AppComponent,
    MenuBarComponent,
    GraphListComponent,
    GraphRowComponent,
    GraphHolderComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
