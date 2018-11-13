import { Component, OnInit, Input, ViewChild, ElementRef, ViewChildren } from '@angular/core';
import { Chart } from 'chart.js';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { ChartData } from '../models/chartdata.model';


@Component({
  selector: 'app-graph-holder',
  templateUrl: './graph-holder.component.html',
  styleUrls: ['./graph-holder.component.css']
})

export class GraphHolderComponent implements OnInit {

  @Input() chartData : ChartData;
  dataAndTime: JSON[];
  @Input() update: Subject<ChartData>;

  chart = [];
  htmlRef
  valuesList = [];
  timesList = [];

  constructor(private elementRef : ElementRef, private router: Router) { }

  onClick() {
    //this.router.navigate(['charts']);
  }

  ngOnInit() {

    this.htmlRef = this.elementRef.nativeElement.querySelector('canvas');
    
    this.update.subscribe(chartParams => {
      console.log('value is changing', chartParams);
      this.chartData = chartParams;
      this.updateChart()
    });

    this.dataAndTime= this.chartData.getDataAndTheirTimestamp();
    for(var i = 0; i < this.dataAndTime.length; i++) {
      var jsonObj = JSON.parse(JSON.stringify(this.dataAndTime[i]));
      this.valuesList.push(jsonObj.value);
      this.timesList.push(jsonObj.timestamp);      
    }

    this.updateChart();
  }

  updateChart() {
    this.chart = new Chart(this.htmlRef, {
      type: this.chartData.type,
      data: {
        labels: this.timesList,
        datasets: [
          {
            data: this.valuesList,
            borderColor: '#3cba9f',
            fill: false
          }
        ]
      },
      options: {
        legend: {
          display: false
        },
        scales: {
          xAxes: [{
            display: true
          }],
          yAxes: [{
            display: true
          }],
        }
      }
    });
  }

}
