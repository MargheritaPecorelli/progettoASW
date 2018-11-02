import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-chart-details',
  templateUrl: './chart-details.component.html',
  styleUrls: ['./chart-details.component.css']
})
export class ChartDetailsComponent implements OnInit {

  chart: any;

  type: string;
  id: string;

  constructor(private route: ActivatedRoute) { 

    this.route.params.subscribe(params => {
      this.id = params['id'];
      this.type = params['type'];
    });

  }

  ngOnInit() {
    this.chart = this.route.snapshot.data.chart;
  }

}
