import { Component, OnInit } from '@angular/core';
import { ChartData } from '../models/chartdata.model';
import { DataRetrieverService } from '../services/data-retriever.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {

  sampleChartList : ChartData[];
  list: object;

  defaultChartMeasurement: string[] = ['Temperature', 'Pressure', 'p.m.'];
  defaultChartRange: string[] = ['Last Week', 'Last Week', 'Last Week'];
  defaultChartAggregationRange: string[] = ['All values', '1 Hour', '1 Day'];
  defaultChartAggregationType: string[] = ['Average', 'Minimum', 'Max'];
  defaultChartUsedSensors: string[][] = [['All'], ['Level 1'], ['A2', 'A15']];

  constructor(private data: DataRetrieverService) { 
    this.sampleChartList = [];
  }

  ngOnInit() {
    this.data.getSensorData().subscribe(data => {

      for (var _i = 0; _i < 3; _i++) {
        var sensorData : Number[] = [12 * (_i +1), 23 + (_i +1) ,34 - (_i +1) ,45 / (_i +1) ,56* (_i +1)];
        this.sampleChartList.push(new ChartData(this.defaultChartAggregationType[_i] + " " + this.defaultChartMeasurement[_i],
                                                this.defaultChartRange[_i], this.defaultChartAggregationRange[_i],
                                                this.defaultChartAggregationType[_i],this.defaultChartUsedSensors[_i], sensorData ));
      }
      /*this.list = data;
      console.log(this.list);
      interface MyObj {
        idSensor: string
      }
  
      let obj: MyObj[] = JSON.parse(JSON.stringify(this.list));
  
      console.log("obj : ", obj);
  
      obj.forEach(element => {
        //TODO: recupera dati dalla risposta 
        var sensorData : Number[] = [12,23,34,45,56];
        this.sampleChartList.push(new ChartData(this.defaultChartAggregationType[0] + this.defaultChartMeasurement[0],
                                                this.defaultChartRange[0], this.defaultChartAggregationRange[0],
                                                this.defaultChartAggregationType[0],this.defaultChartUsedSensors[0], sensorData ));
          

      });*/

    });
  }

}
