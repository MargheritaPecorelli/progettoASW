import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChartData } from '../models/chartdata.model';

@Component({
  selector: 'app-chart-details',
  templateUrl: './chart-details.component.html',
  styleUrls: ['./chart-details.component.css']
})
export class ChartDetailsComponent implements OnInit {

  data: Object;

  chartData: ChartData;

  //chartData: number[] = [12,23,34,45,56,67,78,89];
  //xValue: string[] = ['1','2','3','4','5','6','7','8'];

  type: string;
  id: string;

  constructor(private route: ActivatedRoute) { 

    var defaultData: any = {
      measurement: 'pressure', 
      range: 'Last Week', 
      aggregationRange: '1 Hour',
      aggregationType: 'Minimun', 
      usedSensors: ['Level 1']
    }

    this.route.params.subscribe(params => {
      this.id = params['id'];
      this.type = params['type'];
    });

    this.data = this.route.snapshot.data['data'];
    console.log(" ------------------> Received chart data : " , this.data);
    
    this.chartData = new ChartData(
        defaultData.aggregationType + " " + defaultData.measurement,
        defaultData.range, 
        defaultData.aggregationRange,
        defaultData.aggregationType,
        defaultData.usedSensors, 
        this.data 
      ) ;

    console.log(" ------------------> Generated Chart Data : " , this.chartData);
  }

  ngOnInit() {
  }

}
