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
    // {measurement: 'temperature', range: 'Last Week', aggregationRange: 'every value', aggregationType: 'max', usedSensors: ['All']},
    {measurement: 'pressure', range: 'Last Week', aggregationRange: 'aggregation on the week', aggregationType: 'min', usedSensors: ['A1','A3']},
    // {measurement: 'pm', range: 'Last Week', aggregationRange: '1 Day',aggregationType: 'Max', usedSensors: ['A2','A15']},
    // {measurement: 'temperature', range: 'Last Week', aggregationRange: 'every value',aggregationType: 'average', usedSensors: ['Level 1']}
  ];

  constructor(private data: DataRetrieverService) { 
    this.sampleChartList = [];
  }

  ngOnInit() {
    this.defaultComponents.forEach(elem => {
      this.data.getValuesOfSpecificMeasurementThroughRange(elem.measurement, elem.range).subscribe(data => {
        this.sampleChartList.push(new ChartData(elem.aggregationType + " " + elem.measurement,
                                                elem.range, null, null, elem.aggregationRange,
                                                elem.aggregationType, elem.usedSensors, data ));
      });
    });
  }
}
