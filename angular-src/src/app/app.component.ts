import { Component, OnInit } from '@angular/core';
import { User } from './models/user.model';
import { ChartData } from './models/chartdata.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {

  //title = 'angular-src';

  user : User; 
  sampleChartList : ChartData[];

  constructor() {
    this.user = new User();
    this.sampleChartList = [ new ChartData ("test 1"), 
                             new ChartData ("test 2"), 
                             new ChartData ("test 3") ];
  }

  setLogin(login: boolean) : void {
    this.user.setUserLogged(login);
    if (login)
      console.log("User has logged in");
    else 
      console.log("User has logged out");
  }

  getChartList() : ChartData[] {
    return this.sampleChartList;
  }

}
