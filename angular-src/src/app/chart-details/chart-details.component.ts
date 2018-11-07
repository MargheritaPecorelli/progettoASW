import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChartData } from '../models/chartdata.model';
import { FormGroup, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { Sensor } from '../models/sensor.model';
import { DataRetrieverService } from '../services/data-retriever.service';

/* interface Block {
  id: string,
  name: string
} */

interface Level {
  id: string,
  name: string,
  blocks: string[]
}


@Component({
  selector: 'app-chart-details',
  templateUrl: './chart-details.component.html',
  styleUrls: ['./chart-details.component.css']
})

export class ChartDetailsComponent implements OnInit {

  availableChartType: string[] = ['type1','type2','type3','type4'];
  availableAggregationRange: string[] = ['1 Hour','1 Day','1 Week','1 Month'];
  availableAggregationType: string[] = ['Average','Min','Max','Peak'];
  selectedSensors: Sensor[] = [];

  locationList: Level[] = [
    { id: '1', name: 'Level 1', blocks: ['A']},
    { id: '2', name: 'Level 2', blocks: ['A','B','C','D']},
    { id: '3', name: 'Level 3', blocks: ['A','B','C','D']},
    { id: '4', name: 'Level 4', blocks: ['A','B','C','D']}
  ]


  ///////////////////

  type: string;
  id: string;

  realtime: boolean = false;
  selectAll: boolean = false;

  data: Object;

  chartData: ChartData;


  ///////////////// Sensors selection modal ////////////
  sensorsControl
  

  //TODO: FILTER FOR AVAILABLE MEASUREMENT 
  
  availableSensors: Sensor[];

  constructor(private route: ActivatedRoute, private formBuilder: FormBuilder, private dbRetrieverService: DataRetrieverService ) { 

    var defaultData: any = {
      measurement: 'pressure', 
      range: 'Last Week', 
      aggregationRange: 'aggregation on the day',
      aggregationType: 'min', 
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
        null,
        null, 
        defaultData.aggregationRange,
        defaultData.aggregationType,
        defaultData.usedSensors, 
        this.data 
      ) ;

    console.log(" ------------------> Generated Chart Data : " , this.chartData);
  }

  

  ngOnInit() {

    var sensors = this.route.snapshot.data['sensors'];
    this.availableSensors = [];

    sensors.forEach(element => {
      var sensor = new Sensor(element.name, element.idSensor, element.position, undefined, undefined, element.measurement);
      var posId = element.position.idLocation;
      this.dbRetrieverService.getSpecificLocation(posId).subscribe(location => {
        var loc = JSON.parse(JSON.stringify(location));
        sensor.positionName = loc.name + ' | ' + loc.room;
        sensor.location = loc;
        this.availableSensors.push(sensor);
        this.sensorsControl = this.availableSensors.map(c => ({sensor: c, selected: false}));
      });
    });  
    
  }

  toggleRealtime(event: any){

    this.realtime = ! this.realtime;

    console.log("Real time update enabled: " , this.realtime);
  }

  onChangeChartType(chartType: string){

    console.log("Chart type selected: " , chartType);

  }

  onChangeAggregationValue(aggregation: string) {

    console.log("Aggregation type selected: " , aggregation);

  }

  onChangeRangeValue(range: string) {

    console.log("Aggregation range selected: " , range);

  }


  ////////////////// Sensor Selector Modal ///////////////////////

  selectAllSensors(event: any) {

    //this.selectAll = !this.selectAll;

    console.log("Select all sensors : " , this.selectAll);

    for( var i= 0 ; i < this.sensorsControl.length; i ++) {
      this.sensorsControl[i].selected = this.selectAll;
    }

    console.log(this.sensorsControl);

  }

  checkSelected(event: any) {

    this.selectAll = this.sensorsControl.every(function(item:any) {
      return item.selected == true;
    });

  }

  submitModal() {

    this.selectedSensors = [];


    this.sensorsControl.forEach( element => {
      if ( element.selected ) {
        this.selectedSensors.push(element.sensor);
      }      
    });

    console.log("Selected Sensors: " , this.selectedSensors);
  }

  selectLevel(event: any){
    console.log("event : ", event);
    console.log("Selected : ", event.target.name);
  }

}
