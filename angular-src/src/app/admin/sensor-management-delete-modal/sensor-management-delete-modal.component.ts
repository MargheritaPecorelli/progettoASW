import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Sensor } from 'src/app/models/sensor.model';

@Component({
  selector: 'app-sensor-management-delete-modal',
  templateUrl: './sensor-management-delete-modal.component.html',
  styleUrls: ['./sensor-management-delete-modal.component.css']
})
export class SensorManagementDeleteModalComponent implements OnInit {

  @Input() sensor: Sensor
  @Output() onModalSubmitted: EventEmitter<Sensor>

  constructor() {
    this.onModalSubmitted = new EventEmitter();
    
   }

  ngOnInit() {
    console.log(" ------------> sensorDeleteModal : received sensor : " , this.sensor);
  }

  confirmDeletion() {
    console.log("Deletion confirmed ! saving changes");
    console.log("------------> sensorDeleteModal : Deleting sensor: ", this.sensor);
    this.onModalSubmitted.emit(this.sensor);
  }

}
