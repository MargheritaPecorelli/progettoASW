import { Component, OnInit } from '@angular/core';
import { User } from './models/user.model';
import { DataRetrieverService } from './services/data-retriever.service';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit{

  user : User;
  sensors: string[];
  measurements: string[]; 
  

  constructor(private dbRetrieverService: DataRetrieverService) {
    this.user = new User();
    this.sensors = [];
    this.measurements = [];
  }

  setLogin(login: boolean) : void {
    this.user.setUserLogged(login);
    if (login)
      console.log("User has logged in");
    else 
      console.log("User has logged out");
  }

  ngOnInit() {
    this.dbRetrieverService.getMeasurements().subscribe(measureList => {

      console.log("Available measurement: ", measureList);
      var jsonList = JSON.parse(JSON.stringify(measureList));

      jsonList.forEach(measure => {
        this.measurements.push(measure.measurementType);
        //console.log("Measurement : ", measure.measurementType);
      });
    
    });

    this.dbRetrieverService.getSensors().subscribe(sensorList => {
      console.log("Available sensor: ", sensorList);
      
      var jsonList = JSON.parse(JSON.stringify(sensorList));

      jsonList.forEach(sensor => {
        this.sensors.push((sensor.idSensor + " | " + sensor.name));
        //console.log("Sensor : ", (sensor.idSensor + "-" + sensor.name));
      });
    });
  }

}
