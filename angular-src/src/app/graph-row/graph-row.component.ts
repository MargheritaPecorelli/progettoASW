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

}
