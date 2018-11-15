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
  dataAndTime;
  @Input() update: Subject<ChartData>;

  chart: Chart;

  chartList: Chart[];

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

    // this.dataAndTime= this.chartData.getDataAndTheirTimestamp();
    // for(var i = 0; i < this.dataAndTime.length; i++) {
    //   var jsonObj = JSON.parse(JSON.stringify(this.dataAndTime[i]));
    //   this.valuesList.push(jsonObj.value);
    //   this.timesList.push(jsonObj.timestamp);      
    // }

    this.updateChart();

    
  }

  updateChart() {

    console.log("Changing type to ", this.chartData.type);
    var chartType = this.chartData.type;

    console.log(" ------------------> GraphHolderComponent : " , this.chartData);
    console.log(" ------------------> GraphHolderComponent data: " , this.chartData.data);


    this.dataAndTime= this.chartData.getDataAndTheirTimestamp();
    console.log(" ------------------> GraphHolderComponent dataAndTime : " , this.dataAndTime);


    // if(this.dataAndTime[0].length === undefined) {
      this.timesList = [];
      this.valuesList = [];
      for(var i = 0; i < this.dataAndTime.length; i++) {
        var jsonObj = JSON.parse(JSON.stringify(this.dataAndTime[i]));
        this.valuesList.push(jsonObj.value);
        this.timesList.push(jsonObj.timestamp);      
      }
      var chartData = {
        labels: this.timesList,
        datasets: [
          {
            data: this.valuesList,
            borderColor: '#3cba9f',
            fill: false
          }
        ]
      }
      // Remove the old chart and all its event handles
      if(this.chart) {
        console.log("chart : ", this.chart);
        this.chart.destroy();
      }
  
      this.chart = new Chart(this.htmlRef, {
        type: chartType,
        data: chartData,
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
    // } else {
    //   // var charts = [];
    //   for(var j = 0; j < this.dataAndTime.length; j++) {
    //     this.timesList = [];
    //     this.valuesList = [];
    //     for(var i = 0; i < this.dataAndTime[j].length; i++) {
    //       var list = this.dataAndTime[j];
    //       var jsonObj = JSON.parse(JSON.stringify(list[i]));
    //       this.valuesList.push(jsonObj.value);
    //       this.timesList.push(jsonObj.timestamp);      
    //     }
    //     var chartData = {
    //       labels: this.timesList,
    //       datasets: [
    //         {
    //           data: this.valuesList,
    //           borderColor: '#3cba9f',
    //           fill: false
    //         }
    //       ]
    //     }
    //     // Remove the old chart and all its event handles
    //     if(this.chart) {
    //       console.log("chart : ", this.chart);
    //       this.chart.destroy();
    //     }
    //     this.chart = new Chart(this.htmlRef, {
    //       type: chartType,
    //       data: chartData,
    //       options: {
    //         legend: {
    //           display: false
    //         },
    //         scales: {
    //           xAxes: [{
    //             display: true
    //           }],
    //           yAxes: [{
    //             display: true
    //           }],
    //         }
    //       }
    //     });      
    //   }
    // }

  }

}
