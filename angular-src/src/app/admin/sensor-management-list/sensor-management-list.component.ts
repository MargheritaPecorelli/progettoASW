import { Component, OnInit, Input } from '@angular/core';
import { Sensor } from 'src/app/models/sensor.model';
import { Location } from 'src/app/models/location.model';

@Component({
  selector: 'app-sensor-management-list',
  templateUrl: './sensor-management-list.component.html',
  styleUrls: ['./sensor-management-list.component.css']
})
export class SensorManagementListComponent implements OnInit {

  @Input() sensorList = [];
  @Input() locationList = [];
  @Input() measurementList;
  
  constructor() { 
  }

  ngOnInit() {
    console.log(" ---> sensorList : received sensors : " , this.sensorList);
    console.log(" ---> locationList : received locations : " , this.locationList);
    console.log(" ---> measurementList : received measurements : " , this.measurementList);
  }

  deletedSensor(sensor) {
    console.log("---> sensorList : updating sensor list after deletion");
    console.log(this.sensorList);
    console.log(sensor);
    this.sensorList = this.sensorList.filter(sens => sens.idSensor != sensor.idSensor);
    console.log("---> sensorList : ", this.sensorList);
  }

}
