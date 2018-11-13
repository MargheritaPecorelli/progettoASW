import { Component, OnInit, Testability } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { ChartData } from '../models/chartdata.model';
import { Sensor } from '../models/sensor.model';
import { Location } from '../models/location.model';
import { DataRetrieverService } from '../services/data-retriever.service';
import { from } from 'rxjs';

interface Measurement{
  measurementType: string,
  uom: string
}


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
  sensors: object[],
  selected: boolean
}

interface A {
  rooms : Object,
  blocks: Object,
  levels: Object,
  levelList: Object[]
}

interface B {
  sensorsList, 
  sensorsControl
}

interface SensorControlObject{
  sensor: Sensor,
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
  ///////////////// Sensors selection modal ////////////
  sensorsControl: Object = {};

  levels: Object = {};
  rooms: Object = {};
  blocks: Object = {};
  ///////////////////

  type: string;
  id: string;

  realtime: boolean = false;
  selectAll: boolean = false;

  data: Object;

  levelList: Array<string>;

  chartData: ChartData;

  //TODO: FILTER FOR AVAILABLE MEASUREMENT ?
  
  sensorsList: Sensor[];

  constructor(private route: ActivatedRoute, private dbRetrieverService: DataRetrieverService, private router: Router ) { 
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
      this.levels = {}
      this.rooms = {}
      this.blocks = {}
      this.levelList = []
      this.sensorsList = []
      this.sensorsControl = {}
      var updateLists = function(contextClass) {

        var createTree = function (sensorsList, sensorsControl) {
          var toReturn: A = {rooms: {}, blocks: {}, levels: {}, levelList: []};
  
          return new Promise(resolve => { 
            for(var i = 0; i< sensorsList.length;i++){
              var control = sensorsControl[`${sensorsList[i]}`];
              if ( toReturn.rooms[control.sensor.location.idLocation] ) {
                if (!toReturn.rooms[control.sensor.location.idLocation].sensors.includes(control.sensor.id)) {
                  toReturn.rooms[control.sensor.location.idLocation].sensors.push(control.sensor.id);
                }
              } else {
                toReturn.rooms[control.sensor.location.idLocation] = { id: control.sensor.location.idLocation,
                                                                  name: control.sensor.location.name, 
                                                                  sensors: [control.sensor.id],
                                                                  selected: false};
              } 
              
              var blockID = control.sensor.location.block + control.sensor.location.level
              if ( toReturn.blocks[blockID] ) {

                if (!toReturn.blocks[blockID].rooms.includes(control.sensor.location.idLocation)){
                  toReturn.blocks[blockID].rooms.push(control.sensor.location.idLocation);
                }
              } else {
                toReturn.blocks[blockID] = { id: blockID, 
                                              name: 'Block ' + control.sensor.location.block, 
                                              rooms: [control.sensor.location.idLocation], 
                                              selected: false};
              }  


              if (toReturn.levels[control.sensor.location.level] ) {
                if (!toReturn.levels[control.sensor.location.level].blocks.includes(blockID)){
                  toReturn.levels[control.sensor.location.level].blocks.push(blockID);
                }
              } else {
                toReturn.levels[control.sensor.location.level] = { id: control.sensor.location.level, 
                                                                    name: 'Level ' + control.sensor.location.level, 
                                                                    blocks: [blockID], 
                                                                    selected: false};
                toReturn.levelList.push(control.sensor.location.level)

              }  
            }
            resolve(toReturn);
          });
      }
      
        var f = async function(contextClass)  {
            let result = await createTree(contextClass.sensorsList, contextClass.sensorsControl) as A;
  
            contextClass.levels = result.levels
            contextClass.blocks = result.blocks
            contextClass.rooms = result.rooms  
            console.log(result.levelList)
            
            contextClass.levelList = result.levelList;
        }
        f(contextClass);
      }
  
      var updateListLauncher = async function(contextClass, sensors) {
        let res = await sensorControllerBinder(sensors, contextClass.dbRetrieverService, contextClass.id) as B;
        contextClass.sensorsControl = res.sensorsControl;
        contextClass.sensorsList = res.sensorsList;
        updateLists(contextClass);   
      }
  
  
  
      var sensorControllerBinder = function(sensors, dbRetrieverService, measurementType: string) {
        var measurementsListContainsId = function(measurements: Measurement[], id:string){
          var contains = false;
          for(var i = 0; i< measurements.length; i++) {
            if (measurements[i].measurementType === id) {
              contains = true;
            }
          }
          return contains;
        }
        return new Promise(resolve => { 
          var counter = 0;
          var sensorsList = [];
          var sensorsControl = {};
          sensors.forEach(element => {
            var sensor = new Sensor(element.name, element.idSensor, element.position, undefined, undefined, element.measurements);
            var posId = element.position.idLocation;
            console.log("posid", posId)
            dbRetrieverService.getSpecificLocation(posId).subscribe(location => {
              var loc = JSON.parse(JSON.stringify(location));
              sensor.positionName = loc.name + ' | ' + loc.room;
              sensor.location = loc
              if(measurementsListContainsId(sensor.measurements as Measurement[], measurementType)) {
                console.log(sensor)
                sensorsList.push(sensor.id);
                sensorsControl[sensor.id] = {'sensor': sensor, 'selected': false}; 
              }
              counter ++;
              if(counter == (sensors.length)) {
                resolve({sensorsList, sensorsControl});
              }
            });
          });  
        });
      }
      this.sensorsList = [];
      var sensors = this.route.snapshot.data['sensors'];
      console.log("sensors", sensors)
      updateListLauncher(this,  sensors);
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
        null,
        defaultData.usedSensors, 
        this.data 
      ) ;

    console.log(" ------------------> Generated Chart Data : " , this.chartData);
  }
  

  ngOnInit() {
  }

  updateSensor(sensor: Sensor, selected: boolean) {
    this.checkRoomAndUpdate(sensor.location);
  }

  checkLevelAndUpdate(location: Location){
    var allSelected = true;
    var levelSelected = this.levels[`${location.level}`];

    var blockList = levelSelected.blocks;
    for(var i = 0; i < blockList.length ; i++ ){
      allSelected = allSelected && this.blocks[`${blockList[i]}`].selected
    }
    levelSelected.selected = allSelected
  }

  checkBlockAndUpdate(location: Location) {
    var allSelected = true;
    var blockSelected = this.blocks[`${location.block + location.level}`];
    var roomList = blockSelected.rooms;
    for(var i = 0; i < roomList.length ; i++ ){
      allSelected = allSelected && this.rooms[`${roomList[i]}`].selected
    }
    blockSelected.selected = allSelected
    this.checkLevelAndUpdate(location);
  }

  checkRoomAndUpdate(location: Location) {
    var allSelected = true;
    var roomSelected = this.rooms[`${location.idLocation}`];
    var roomSelectedBefore = roomSelected.selected;
    var sensorsList = roomSelected.sensors;
    for(var i = 0; i < sensorsList.length ; i++ ){
      allSelected = allSelected && this.sensorsControl[`${sensorsList[i]}`].selected
    }
    roomSelected.selected = allSelected
    if(roomSelectedBefore!= roomSelected.selected) {
      this.checkBlockAndUpdate(location);
    }
  }

  updateLevel(level: string, selected: boolean) {
    this.levels[level].blocks.forEach( block => {
      this.updateBlock(block, selected);
    });
  }

  updateBlock(block: string, selected: boolean) {
    this.blocks[block].selected = selected
    this.blocks[block].rooms.forEach( room => {
      this.updateRoom(room, selected);
    });
  }

  updateRoom(room: string, selected: boolean) {
    this.rooms[room].selected = selected
    this.rooms[room].sensors.forEach( sensor => {
      this.sensorsControl[`${sensor}`].selected = selected;
      this.checkBlockAndUpdate(this.sensorsControl[`${sensor}`].sensor.location)
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

  submitModal() {

    this.selectedSensors = [];


    this.sensorsList.forEach( element=> {
      var e = this.sensorsControl[`${element}`] as SensorControlObject;
      if ( e.selected ) {
        this.selectedSensors.push(e.sensor);
      }      
    });

    console.log("Selected Sensors: " , this.selectedSensors);
  }

  

  

  selectAllSensors(selected: boolean) {
    this.levelList.forEach(levelName => {
      this.updateLevel(levelName, selected);
    });
  }
}
