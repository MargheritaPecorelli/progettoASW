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

  defaultComponents: any = [
    {measurement: 'temperature', range: 'Last Week', aggregationRange: 'All values',aggregationType: 'Average', usedSensors: ['All']},
    {measurement: 'pressure', range: 'Last Week', aggregationRange: '1 Hour',aggregationType: 'Minimun', usedSensors: ['Level 1']},
    // {measurement: 'pm', range: 'Last Week', aggregationRange: '1 Day',aggregationType: 'Max', usedSensors: ['A2','A15']},
    {measurement: 'temperature', range: 'Last Week', aggregationRange: 'All values',aggregationType: 'Average', usedSensors: ['All']}
  ];

  // defaultChartMeasurement: string[] = ['temperature', 'pressure', 'pm'];
  // defaultChartRange: string[] = ['Last Week', 'Last Week', 'Last Week'];
  // defaultChartAggregationRange: string[] = ['All values', '1 Hour', '1 Day'];
  // defaultChartAggregationType: string[] = ['Average', 'Minimum', 'Max'];
  // defaultChartUsedSensors: string[][] = [['All'], ['Level 1'], ['A2', 'A15']];

  constructor(private data: DataRetrieverService) { 
    this.sampleChartList = [];
  }

  ngOnInit() {
    this.defaultComponents.forEach(elem => {
      this.data.getValuesOfSpecificMeasurementThroughRange(elem.measurement, elem.range).subscribe(data => {
        console.log(data);
        console.log( elem.aggregationType + " - " + elem.measurement);
        this.sampleChartList.push(new ChartData(elem.aggregationType + " " + elem.measurement,
                                                elem.range, elem.aggregationRange,
                                                elem.aggregationType,elem.usedSensors, data ));
        console.log(this.sampleChartList.length);
      });
    })




    // var _i = 0;

    // this.defaultChartAggregationRange.forEach(element => {
    //   var aggregationType = this.defaultChartAggregationType[_i];
    //   var aggregationRange = this.defaultChartAggregationRange[_i];
    //   var measurement = this.defaultChartMeasurement[_i];
    //   var range = this.defaultChartRange[_i];
    //   var usedSensors = this.defaultChartUsedSensors[_i];

    //   this.data.getSensorDataWithRange(this.defaultChartMeasurement[_i], this.defaultChartRange[_i]).subscribe(data => {
    //     console.log("ciaoooooo " + _i);
    //     console.log( aggregationType + " - " + measurement);
    //     this.sampleChartList.push(new ChartData(aggregationType + " " + measurement,
    //                                             range, aggregationRange,
    //                                             aggregationType,usedSensors, data ));
    //     _i++;
    //     console.log(this.sampleChartList.length);
    //   });      
    // });
  }

}
