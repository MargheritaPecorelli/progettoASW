import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Sensor } from 'src/app/models/sensor.model';
import { DataRetrieverService } from 'src/app/services/data-retriever.service';
import { Location } from 'src/app/models/location.model';

@Component({
  selector: 'app-sensor-management-row',
  templateUrl: './sensor-management-row.component.html',
  styleUrls: ['./sensor-management-row.component.css']
})
export class SensorManagementRowComponent implements OnInit {


  @Input() sensor;
  @Input() index: string;
  @Output() deletedSensor: EventEmitter<JSON>;
  @Input() locationList: Location[];
  @Input() measurementList;

  constructor(private dbRetrieverService: DataRetrieverService) { 
    this.deletedSensor = new EventEmitter();
  }

  ngOnInit() {
    console.log(" ------> sensorRow : received sensor : " , this.sensor);
    console.log(" ------> sensorRow : received locationList : " , this.locationList);
    console.log(" ------> sensorRow : received measurementList : " , this.measurementList);
  }

  // updateAccessLevel(selected: boolean) {
  //   console.log("User is admin : ", selected);
  // }

  updateSensor(updatedSensor: Sensor){
    console.log("------> sensorRow : Updating Sensor : " , updatedSensor);
    console.log('measurements: ' + JSON.stringify(this.sensor.measurements));
    this.dbRetrieverService.putNewSensorPosition(this.sensor.idSensor, JSON.stringify(this.sensor.position)).subscribe(res => {});
    if(this.sensor.measurements.length > 0) {
      this.dbRetrieverService.putNewSensorMeasurement(this.sensor.idSensor, JSON.stringify(this.sensor.measurements)).subscribe(res => {});
    }    
    this.sensor = updatedSensor;
  }

  deleteSensor(sens) {
    console.log("------> sensorRow : deleting Sensor : " , sens);
    this.dbRetrieverService.deleteSpecificSensor(sens.idSensor).subscribe(response => {
      this.deletedSensor.emit(sens);
      this.sensor = undefined;
    });
    this.deletedSensor.emit(sens);
    this.sensor = undefined;
  }
}
