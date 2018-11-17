import { Component, OnInit } from '@angular/core';
import { User } from './models/user.model';
import { DataRetrieverService } from './services/data-retriever.service';
import { AuthenticationService } from './services/authentication/authentication.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit{

  user : User;
  sensors: string[];
  measurements: string[]; 
  

  constructor(private dbRetrieverService: DataRetrieverService, public authService: AuthenticationService) {
    this.sensors = [];
    this.measurements = [];
  }

  ngOnInit() {
    this.dbRetrieverService.getAllMeasurements().subscribe(measureList => {

      var jsonList = JSON.parse(JSON.stringify(measureList));

      jsonList.forEach(measure => {
        this.measurements.push(measure.measurementType);
      });
    
    });

    this.dbRetrieverService.getAllSensors().subscribe(sensorList => {
      
      var jsonList = JSON.parse(JSON.stringify(sensorList));

      jsonList.forEach(sensor => {
        this.sensors.push((sensor.idSensor));
      });
    });
  }

}
