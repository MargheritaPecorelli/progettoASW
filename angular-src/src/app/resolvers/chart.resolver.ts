import { Injectable } from '@angular/core';

import { Resolve, ActivatedRouteSnapshot } from '@angular/router';

import { DataRetrieverService } from '../services/data-retriever.service';
import { ChartData } from '../models/chartdata.model';
import { Observable } from 'rxjs';

@Injectable()
export class ChartResolver implements Resolve<ChartData> {

  constructor(private dbRetrieverService: DataRetrieverService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> {

      var type: string = route.params.type;
      var id: string = route.params.id;

      console.log("Retrieving data for chart " + id + " of type " + type);

      var defaultData = {
      measurement: type, 
      range: 'last 30 days', 
      aggregationRange: 'aggregation on hours', 
      aggregationType: null, 
      usedSensors: 'all'
      }

      if (type == 'm'){
        console.log("Retrieving data for measurement : " + id);
        return this.dbRetrieverService.getValuesOfSpecificMeasurementThroughRange(id,defaultData.range);
      } else if ( type == 's') {
        console.log("Retrieving data for sensors: " + id);
        var list = this.dbRetrieverService.getSensorValuesThroughRange(id,defaultData.range);
        console.log(list);
        return list
      }

      //return this.dbRetrieverService.getValuesOfSpecificMeasurementThroughRange(defaultData.measurement, defaultData.range);

    }

    /*
  getChartData(type: string): any {
    
    var defaultData: any = {
      measurement: 'pressure', 
      range: 'Last Week', 
      aggregationRange: '1 Hour',
      aggregationType: 'Minimun', 
      usedSensors: ['Level 1']
    }

    this.dbRetrieverService.getSensorDataWithRange(defaultData.measurement, defaultData.range)
                           .subscribe(data => {
                              console.log("Data received from server ");
                              console.log(data);
                              var chartData = new ChartData(
                              defaultData.aggregationType + " " + defaultData.measurement,
                              defaultData.range, 
                              defaultData.aggregationRange,
                              defaultData.aggregationType,
                              defaultData.usedSensors, 
                              data ) ;

                              return chartData; 
    });
  }

  */

}