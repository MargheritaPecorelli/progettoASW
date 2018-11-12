import { Component, OnInit } from '@angular/core';
import { ChartData } from '../models/chartdata.model';
import { DataRetrieverService } from '../services/data-retriever.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {

  sampleChartList : ChartData[];
  list: object;

  defaultComponents: any = [
    {measurement: 'pressure', range: 'last 30 days', aggregationRange: 'every value', aggregationType: null, usedSensors: null},
    // {measurement: 'pressure', range: 'last 30 days', aggregationRange: 'aggregation on hours',aggregationType: 'max', usedSensors: null},
    // {measurement: 'pressure', range: 'last 30 days', aggregationRange: 'aggregation on days', aggregationType: 'moda', usedSensors: null},
    // {measurement: 'temperature', range: 'last 30 days', aggregationRange: 'aggregation on months',aggregationType: 'average', usedSensors: null},
    // {measurement: 'temperature', range: 'last 30 days', aggregationRange: 'aggregation every X days',aggregationType: 'min', usedSensors: null},
    // {measurement: 'temperature', range: 'last 30 days', aggregationRange: 'aggregation of every value',aggregationType: 'average', usedSensors: null},
    // {measurement: 'temperature', range: 'last 30 days', aggregationRange: 'aggregation on day and night',aggregationType: 'average', usedSensors: null}
  ];

  constructor(private data: DataRetrieverService) { 
    this.sampleChartList = [];
  }

  ngOnInit() {
    this.defaultComponents.forEach(elem => {
      this.data.getValuesOfSpecificMeasurementThroughRange(elem.measurement, elem.range).subscribe(data => {
        this.sampleChartList.push(new ChartData(elem.aggregationType + " " + elem.measurement,
                                                elem.range, null, null, elem.aggregationRange,
                                                elem.aggregationType, 7, elem.usedSensors, data ));
      });
    });

    // this.data.getLevels('cesena', 'cesena').subscribe(locations => 
    //   console.log('levels ' + locations)
    // );
    
    // this.data.getBlocks('cesena', 'cesena', 3).subscribe(blocks => 
    //   console.log('blocks ' + blocks)
    // );
    
    // this.data.getRooms('cesena', 'cesena', 3, 'A').subscribe(rooms => {
    //   var list = JSON.parse(JSON.stringify(rooms));
    //   for(var i = 0; i < list.length; i++) {
    //     console.log(list[i].idLocation + '-' + list[i].name + '-' + list[i].room);
    //   }
    // });
    
    // this.data.getSensorsOfARoom('R1').subscribe(sensors => {
    //   var sens = JSON.parse(JSON.stringify(sensors));
    //   for(var i = 0; i < sens.length; i++) {
    //     console.log(sens[i].idSensor + '-' + sens[i].name);
    //   }
    // });
    
  }
}
