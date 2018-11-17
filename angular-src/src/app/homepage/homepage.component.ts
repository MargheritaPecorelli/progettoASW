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
    {measurement: 'pressure', range: 'last 30 days', aggregationRange: 'aggregation on hours',aggregationType: 'max', usedSensors: ['all']},
    {measurement: 'pm', range: 'last 30 days', aggregationRange: 'aggregation on days', aggregationType: 'moda', usedSensors: ['all']},
    {measurement: 'temperature', range: 'last 30 days', aggregationRange: 'aggregation on months',aggregationType: 'average', usedSensors: ['all']},
    {measurement: 'temperature', range: 'last 30 days', aggregationRange: 'aggregation of every value',aggregationType: 'average', usedSensors: ['all']},
  ];

  constructor(private data: DataRetrieverService) {
    this.sampleChartList = [];
  }

  ngOnInit() {

    this.defaultComponents.forEach(elem => {
      this.data.getValuesOfSpecificMeasurementThroughRange(elem.measurement, elem.range).subscribe(data => {
        this.sampleChartList.push(new ChartData(elem.aggregationType + " " + elem.measurement,
                                                elem.range, null, null, elem.aggregationRange,
                                                elem.aggregationType, 7, elem.usedSensors, data ));
      });
    });

  }
}
