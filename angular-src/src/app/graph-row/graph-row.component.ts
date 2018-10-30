import { Component, Input, OnInit } from '@angular/core';
import { ChartData } from '../models/chartdata.model'

@Component({
  selector: 'app-graph-row',
  templateUrl: './graph-row.component.html',
  styleUrls: ['./graph-row.component.css']
})
export class GraphRowComponent implements OnInit {

  @Input() chart: ChartData;

  constructor() { 
    
  }

  ngOnInit() {}

}
