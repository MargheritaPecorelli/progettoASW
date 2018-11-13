import { Component, Input, OnInit } from '@angular/core';
import { ChartData } from '../models/chartdata.model'
import { Subject } from 'rxjs';

@Component({
  selector: 'app-graph-row',
  templateUrl: './graph-row.component.html',
  styleUrls: ['./graph-row.component.css']
})
export class GraphRowComponent implements OnInit {

  @Input() chart: ChartData;
  chartUpdater: Subject<ChartData> = new Subject();

  constructor() { }

  ngOnInit() {}

  updateChart(data: ChartData){
    this.chartUpdater.next(data);
  }

  testType() {
    console.log("old chart type: ", this.chart.type);
    if (this.chart.type == 'line' ) {
      this.chart.type = 'bar';
    } else {
      this.chart.type = 'line';
    }

    console.log("new chart type: ", this.chart.type);
    console.log("updating chart");
    this.updateChart(this.chart);
  };

}
