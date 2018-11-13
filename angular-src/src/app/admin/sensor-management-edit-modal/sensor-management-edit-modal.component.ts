import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Sensor } from 'src/app/models/sensor.model';
import { DataRetrieverService } from 'src/app/services/data-retriever.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from 'src/app/models/location.model';

@Component({
  selector: 'app-sensor-management-edit-modal',
  templateUrl: './sensor-management-edit-modal.component.html',
  styleUrls: ['./sensor-management-edit-modal.component.css']
})
export class SensorManagementEditModalComponent implements OnInit {

  @Input() sensor: Sensor
  @Output() onModalSubmitted: EventEmitter<Sensor>
  @Input() locationList;
  @Input() measurementList;

  sortedList = [];
  measurements = [];
  oldMeasurementsToAdd = [];
  oldSensorMeasurements = [];

  sensorForm: FormGroup;

  constructor(private fb: FormBuilder, private dataRetriever: DataRetrieverService, private route: ActivatedRoute) { 
    this.onModalSubmitted = new EventEmitter();
  }

  ngOnInit() {
    console.log(" ------> sensorEditModal : received sensor : " , this.sensor);
    console.log(" ------> sensorEditModal : received locationList : " , this.locationList);
    console.log(" ------> sensorEditModal : received measurementList : " , this.measurementList);

    var loc = JSON.parse(JSON.stringify(this.sensor.position));
    
    var newList = this.locationList.filter(elem => {
      return elem.idLocation != loc.idLocation
    });
    console.log(" ------> sensorEditModal : newList : " , newList);

    var j = -1;
    for(var i = 0; i < this.locationList.length; i++) {
      if(this.locationList[i].idLocation == loc.idLocation) {
        j = i;
      }
    }
    console.log(" ------> sensorEditModal : index j : " , j);
    this.sortedList.push(this.locationList[j]);
    for(var k = 0; k < newList.length; k++) {
      this.sortedList.push(newList[k]); 
    }
    console.log(" ------> sensorEditModal : received locationList after sort : " , this.sortedList);

    this.getMeasurements();
    this.oldMeasurementsToAdd = this.measurements;
    for(var f = 0; f < this.sensor.measurements.length; f++) {
      this.oldSensorMeasurements.push(this.sensor.measurements[f]);
    }
    
    console.log(" ------------> sensorEditModal : old measuremnts to add: " , this.oldMeasurementsToAdd);
    console.log(" ------------> sensorEditModal : old sensor's measuremnts: " , this.oldSensorMeasurements);

    this.sensorForm = this.fb.group ({
      'name': [`${this.sensor.name}`, Validators.required],
      'location': [`${loc.idLocation}`, Validators.required],
      'measurements': [`${this.sensor.measurements}`]
    });

    console.log(" ------------> sensorEditModal : received sensor after form build: " , this.sensorForm);

  }

  submitModal(value) {
    console.log("modal submitted ! saving changes");
    this.sensor.name = value.name.toString();
    var pos = JSON.parse(JSON.stringify(this.sensor.position));
    pos.idLocation = value.location.toString().split(" ")[0];
    this.sensor.position = pos;
    console.log(" ------------> sensorEditModal sensor after changes :" , this.sensor);
    this.onModalSubmitted.emit(this.sensor);
  }

  close() {
    console.log('closing : none of the chenges has been saved!');
    this.measurements = [];
    this.measurements = this.oldMeasurementsToAdd;
    this.sensor.measurements = [];
    this.sensor.measurements = this.oldSensorMeasurements;
  }

  modifyMeasurements(event) {
    // console.log(event);
    var newMeas = this.measurementList.filter(e => JSON.parse(JSON.stringify(e)).measurementType === event);
    this.sensor.measurements.push(newMeas[0]);
    this.getMeasurements();
    // console.log(this.sensor.measurements);
  }

  deleteMeasurement(sensorId, sensorMeasurement){
    var measurementToRemove;
    var measurementsStillHere = [];
    for(var i = 0; i < this.sensor.measurements.length; i++) {
      if(JSON.parse(JSON.stringify(this.sensor.measurements[i])).measurementType === sensorMeasurement) {
        measurementToRemove = this.sensor.measurements[i];
        this.measurements.push(this.sensor.measurements[i]);
      } else {
        measurementsStillHere.push(this.sensor.measurements[i])
      }
    }
    this.sensor.measurements = []
    for(var j = 0; j < measurementsStillHere.length; j++) {
      this.sensor.measurements.push(measurementsStillHere[j])
    }
    this.oldSensorMeasurements = this.sensor.measurements;
    this.oldMeasurementsToAdd = this.measurements;
    this.dataRetriever.deleteSensorMeasurement(sensorId, measurementToRemove).subscribe(res => {});
  }

  removeMyLocation(elem, myLocation) {
    return (elem != myLocation)
  }

  getMeasurements() {
    this.measurements = [];
    this.measurements.push("add a new measurement to this sensor");
    for(var y = 0; y < this.measurementList.length; y++) {
      if(!this.sensor.measurements.some(e => JSON.parse(JSON.stringify(e)).measurementType === this.measurementList[y].measurementType.toString())) {
        this.measurements.push(this.measurementList[y].measurementType);
      }
    }
    console.log(" ------> sensorEditModal : received measurementList after removed the element already present : " , this.measurements);
  }

}
