import { Component, OnInit, Input, ViewChild, ElementRef, ViewChildren } from '@angular/core';
import { Chart } from 'chart.js';
import { Router } from '@angular/router';

@Component({
  selector: 'app-graph-holder',
  templateUrl: './graph-holder.component.html',
  styleUrls: ['./graph-holder.component.css']
})

export class GraphHolderComponent implements OnInit {

  @Input() xValue: string [];
  @Input() data: Number[];
  chart = [];

  constructor(private elementRef : ElementRef, private router: Router) { }

  onClick() {
    console.log("Ho cliccato !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
    this.router.navigate(['charts']);
  }

  ngOnInit() {
    console.log("GraphHolder: drawing chart with data -> " , this.data);
    console.log("GraphHolder: drawing chart with xValue -> " , this.xValue);
    let htmlRef = this.elementRef.nativeElement.querySelector('canvas');

    this.chart = new Chart(htmlRef, {
      type: 'line',
      data: {
        labels: this.xValue,
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
