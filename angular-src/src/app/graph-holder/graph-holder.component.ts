import { Component, OnInit, Input, ViewChild, ElementRef, ViewChildren } from '@angular/core';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-graph-holder',
  templateUrl: './graph-holder.component.html',
  styleUrls: ['./graph-holder.component.css']
})

export class GraphHolderComponent implements OnInit {

  month = ['t1', 't2', 't3', 't4'];
  @Input() data: Number[];
  chart = [];

  constructor(private elementRef : ElementRef) { }

  ngOnInit() {
    let htmlRef = this.elementRef.nativeElement.querySelector('canvas');

    this.chart = new Chart(htmlRef, {
      type: 'line',
      data: {
        labels: this.month,
        datasets: [
          {
            data: this.data,
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
