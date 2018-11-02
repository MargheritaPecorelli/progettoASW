import { Injectable } from '@angular/core';

import { Resolve, ActivatedRouteSnapshot } from '@angular/router';

import { DataRetrieverService } from '../services/data-retriever.service';
import { ChartData } from '../models/chartdata.model';

@Injectable()
export class ChartResolver implements Resolve<ChartData> {
  constructor(private dbRetrieverService: DataRetrieverService) {}

  resolve(route: ActivatedRouteSnapshot) {
      var chartData: ChartData;
      var type: string = route.params.type;
      var id: string = route.params.id;

      console.log("Retrieving data for chart " + id + " of type " + type);

      return new ChartData("test Measurement Chart", "TestRange", "TestAggregation", "TestAggType", ['test', 'test2'], 
      [{
          t1: {timestamp: '12345',
                value: 123}
      }]);

    }

    getChartData(type: string): any {
        
    }
    /*

  getChartData(type: string): any {
    this.dbRetrieverService.getSensors().subscribe(el => {
        console.log("Data received from server ");
        // bisogna usare i metodi giusti
        return new ChartData("test Measurement Chart", "TestRange", "TestAggregation", "TestAggType", ['test', 'test2'], {})
    });
  }

  */

}