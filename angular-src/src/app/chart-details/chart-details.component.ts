import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChartData } from '../models/chartdata.model';
import { Sensor } from '../models/sensor.model';
import { DataRetrieverService } from '../services/data-retriever.service';

interface Level {
  id: string,
  name: string,
  blocks: Block[],
  selected: boolean
}

interface Block {
  id: string,
  name: string,
  rooms: Room[],
  selected: boolean
} 

interface Room {
  id: string,
  name: string,
  locationId: string,
  selected: boolean
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
  
  //todo: retrieve default sensor;
  selectedSensors: Sensor[] = [];

  private roomList: Room[] = [
    { id: '1001', name: 'parking', locationId:'P0', selected: false},
    { id: '2001', name: 'Aula 2.12', locationId:'A212', selected: false},
    { id: '2002', name: 'Lab 2.11', locationId:'L1', selected: false},
    { id: '3003', name: 'Aula 3.5', locationId:'A35', selected: false},
    { id: '4004', name: 'Studio prof. Mirri', locationId:'U1', selected: false}
  ]

  private blockList : Block[] = [
    { id: 'P', name: 'Parking', rooms: [this.roomList[0]], selected: false},
    { id: 'A1', name: 'Block A', rooms: [this.roomList[1],this.roomList[2]], selected: false},
    { id: 'A2', name: 'Block A', rooms: [this.roomList[3],this.roomList[4]], selected: false},
    { id: 'A3', name: 'Block A', rooms: [this.roomList[1],this.roomList[3]], selected: false},
    { id: 'A4', name: 'Block A', rooms: [this.roomList[2],this.roomList[4]], selected: false},

    { id: 'B', name: 'Block B', rooms: [this.roomList[1],this.roomList[2],this.roomList[3]], selected: false},
    { id: 'C', name: 'Block C', rooms: [this.roomList[2],this.roomList[4]], selected: false},
    { id: 'D', name: 'Block D', rooms: [this.roomList[4]], selected: false},
  ]

  private locationList: Level[] = [
    { id: '1', name: 'Level 1', blocks: [this.blockList[0]], selected: false},
    { id: '2', name: 'Level 2', blocks: [this.blockList[1],this.blockList[2],this.blockList[3],this.blockList[4]], selected: false},
    { id: '3', name: 'Level 3', blocks: [this.blockList[5]], selected: false},
    { id: '4', name: 'Level 4', blocks: [this.blockList[6], this.blockList[7]], selected: false}
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
  

  //TODO: FILTER FOR AVAILABLE MEASUREMENT ?
  
  availableSensors: Sensor[];

  constructor(private route: ActivatedRoute, private dbRetrieverService: DataRetrieverService ) { 

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
        console.log(" ----------------> sensor location id: ", loc.idLocation);
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

  selectAllSensors() {

    //this.selectAll = !this.selectAll;

    console.log("Select all sensors : " , this.selectAll);

    for( var i= 0 ; i < this.sensorsControl.length; i ++) {
      this.sensorsControl[i].selected = this.selectAll;
    }

    console.log(this.sensorsControl);

  }

  checkSelected() {

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

  selectLevel(selected: boolean, levelIndex: string){

    this.locationList[levelIndex].blocks.forEach(block => {

      block.selected = selected;
      block.rooms.forEach(room => {

        room.selected = selected;
        this.selectRoom(selected, room.locationId);
        
      });
      
    });
    
  }

  selectBlock(selected: boolean, levelIndex: string, blockIndex: string){

    this.locationList[levelIndex].blocks[blockIndex].rooms.forEach(room => {

      room.selected = selected;
      this.selectRoom(selected, room.locationId);
      
    });
  }

  selectRoom(selected: boolean, locationId: string){

    this.sensorsControl.forEach(element => {
      
      if (element.sensor.position.idLocation == locationId){
        element.selected = selected;
      }
    });

  }

}
