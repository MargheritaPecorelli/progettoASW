import { Injectable } from '@angular/core';

import { Resolve, ActivatedRouteSnapshot } from '@angular/router';

import { DataRetrieverService } from '../services/data-retriever.service';
import { Observable } from 'rxjs';
import { Sensor } from '../models/sensor.model';

@Injectable()
export class MeasurementResolver implements Resolve<Sensor[]> {

  constructor(private dbRetrieverService: DataRetrieverService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    var measurements = this.dbRetrieverService.getAllMeasurements();
    // console.log('SensorsResolver gettAllSensors' + sensors)
    return measurements;
  }

}