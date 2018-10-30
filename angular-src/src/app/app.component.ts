import { Component, OnInit } from '@angular/core';
import { User } from './models/user.model';
import { ChartData } from './models/chartdata.model';
import { DataRetrieverService } from './services/data-retriever.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit{

  //title = 'angular-src';

  user : User; 
  sampleChartList : ChartData[];
  list: object;

  constructor(private data: DataRetrieverService) {
    this.user = new User();
    this.sampleChartList = [];
    /*this.sampleChartList = [ new ChartData ("test 1"), 
                             new ChartData ("test 2"), 
                             new ChartData ("test 3") ];*/
  }

  setLogin(login: boolean) : void {
    this.user.setUserLogged(login);
    if (login)
      console.log("User has logged in");
    else 
      console.log("User has logged out");
  }

  ngOnInit() {

    this.data.getSensors().subscribe(data => {
      this.list = data;
      console.log(this.list);
      interface MyObj {
        idSensor: string
      }
  
      let obj: MyObj[] = JSON.parse(JSON.stringify(this.list));
  
      console.log("obj : ", obj);
  
      obj.forEach(element => {
        console.log(element.idSensor);
        this.sampleChartList.push(new ChartData(element.idSensor));
        console.log(element.idSensor);
      });
      
    });

  }

}
