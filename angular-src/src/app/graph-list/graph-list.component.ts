import { Component, Input, OnInit } from '@angular/core';
import { ChartData } from '../models/chartdata.model';

@Component({
  selector: 'app-graph-list',
  templateUrl: './graph-list.component.html',
  styleUrls: ['./graph-list.component.css']
})
export class GraphListComponent implements OnInit {

  @Input() chartList: ChartData[];

  constructor() { 
  }

  ngOnInit() {
  }

}
