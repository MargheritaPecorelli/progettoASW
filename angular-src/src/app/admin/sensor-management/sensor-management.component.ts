import { Component, OnInit } from '@angular/core';
import { Sensor } from 'src/app/models/sensor.model';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-sensor-management',
  templateUrl: './sensor-management.component.html',
  styleUrls: ['./sensor-management.component.css']
})

export class SensorManagementComponent implements OnInit {

  sensorList: Sensor[];
  locationList: Location[];
  measurementList;
  
  constructor(private route: ActivatedRoute) { 
    this.sensorList = [];
    this.locationList = [];
  }

  ngOnInit() {
    this.sensorList = this.route.snapshot.data['sensors'];
    this.locationList = this.route.snapshot.data['locations'];
    this.measurementList = this.route.snapshot.data['measurements'];
    console.log(" ------------------> Received sensors data : " , this.sensorList);
    console.log(" ------------------> Received locations data : " , this.locationList);
    console.log(" ------------------> Received measurements data : " , this.measurementList);
  }

}
