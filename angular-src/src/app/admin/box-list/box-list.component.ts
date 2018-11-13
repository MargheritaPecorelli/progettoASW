import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-box-list',
  templateUrl: './box-list.component.html',
  styleUrls: ['./box-list.component.css']
})
export class BoxListComponent implements OnInit {

  userImage: string;
  sensorImage: string;
  chartImage: string;

  constructor(private route: ActivatedRoute) {
    this.userImage = this.route.snapshot.data['userImage'];
    this.sensorImage = this.route.snapshot.data['sensorImage'];
    this.chartImage = this.route.snapshot.data['chartImage'];
  }

  ngOnInit() {
  }

}
