import { Component, OnInit, Testability } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChartData } from '../models/chartdata.model';
import { Sensor } from '../models/sensor.model';
import { DataRetrieverService } from '../services/data-retriever.service';
import { groupBy } from 'rxjs/operators';


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
  availableSensors, 
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
//  sensorsControl: SensorControlObject[] = [];
sensorsControl: Array<Object> = [];

  levels: Array<Object>;
  rooms: Array<Object>;
  blocks: Array<Object>;

  /*

  private roomList: Room[] = [
    { id: '1001', name: 'parking', locationId:'P0', sensors: [{id:'' , selected: false}, {id:'' , selected: false}], selected: false},
    { id: '2001', name: 'Aula 2.12', locationId:'A212', sensors: [{id:'A3' , selected: false}] , selected: false},
    { id: '2002', name: 'Lab 2.11', locationId:'L1', sensors: [{id:'A3' , selected: false}, {id:'A1' , selected: false}, {id:'' , selected: false}] , selected: false},
    { id: '3003', name: 'Aula 3.5', locationId:'A35', sensors: [{}] , selected: false},
    { id: '4004', name: 'Studio prof. Mirri', locationId:'U1', sensors: [{}] , selected: false}
  ]

  private blockList : Block[] = [
    { id: 'P', name: 'Parking', rooms: [this.roomList[0]], selected: false},
    { id: 'A1', name: 'Block A', rooms: [this.roomList[1],this.roomList[2]], selected: false},
    { id: 'A2', name: 'Block A', rooms: [this.roomList[3],this.roomList[4]], selected: false},
    { id: 'A3', name: 'Block A', rooms: [this.roomList[1],this.roomList[3]], selected: false},
    { id: 'A4', name: 'Block A', rooms: [this.roomList[2],this.roomList[4]], selected: false},

    { id: 'B', name: 'Block B', rooms: [this.roomList[2]], selected: false},
    { id: 'C', name: 'Block C', rooms: [this.roomList[2],this.roomList[4]], selected: false},
    { id: 'D', name: 'Block D', rooms: [this.roomList[4]], selected: false},
  ]

  private locationList: Level[] = [
    { id: '1', name: 'Level 1', blocks: [this.blockList[0]], selected: false},
    { id: '2', name: 'Level 2', blocks: [this.blockList[2],this.blockList[5],this.blockList[6],this.blockList[7]], selected: false},
    { id: '3', name: 'Level 3', blocks: [this.blockList[5]], selected: false},
    { id: '4', name: 'Level 4', blocks: [this.blockList[4], this.blockList[7]], selected: false}
  ]

  */




  ///////////////////

  type: string;
  id: string;

  realtime: boolean = false;
  selectAll: boolean = false;

  data: Object;

  levelList: Array<Object>;

  chartData: ChartData;



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
        null,
        defaultData.usedSensors, 
        this.data 
      ) ;

    console.log(" ------------------> Generated Chart Data : " , this.chartData);

  }

  

  ngOnInit() {

    var updateLists = function(contextClass) {

      var createTree = function (sensorsControl) {
        var counter = 0;
        var toReturn: A = {rooms: {}, blocks: {}, levels: {}, levelList: []};

        return new Promise(resolve => { 
            // sensorsControl.forEach(control => {
              for(var i = 0; i< sensorsControl.length;i++){
                console.log("i : ", i);
                var control = sensorsControl[i];
                if ( toReturn.rooms[control.sensor.location.id] ) {
                  if (control.sensor.idSensor in toReturn.rooms[control.sensor.location.id].sensors) {
                    toReturn.rooms[control.sensor.location.id].sensors.push(control.sensor.idSensor);
                  }
                } else {
                  toReturn.rooms[control.sensor.location.id] = { id: control.sensor.location.id,
                                                                   name: control.sensor.location.name, 
                                                                   sensors: [control.sensor.idSensor],
                                                                   selected: false};
                } 
                
                var blockID = control.sensor.location.block + control.sensor.location.level
                if ( toReturn.blocks[blockID] ) {
                  console.log(toReturn.blocks[blockID].rooms)

                  if (control.sensor.location.id in toReturn.blocks[blockID].rooms){
                    toReturn.blocks[blockID].rooms.push(control.sensor.location.id);
                    console.log(toReturn.blocks[blockID].rooms)
                  }
                } else {
                  toReturn.blocks[blockID] = { id: blockID, 
                                               name: 'Block ' + control.sensor.location.block, 
                                               rooms: [control.sensor.location.id], 
                                               selected: false};
                }  

                if (toReturn.levels[control.sensor.location.level] ) {
                  if (blockID in toReturn.levels[control.sensor.location.level].blocks){
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
              
              // });
         });
        }
    
      var f = async function(contextClass)  {
          let result = await createTree(contextClass.sensorsControl) as A;

          console.log("sensorsControl : ", contextClass.sensorsControl);
          contextClass.levels = result.levels
          contextClass.blocks = result.blocks
          contextClass.rooms = result.rooms  
          console.log("contextClass.blocks : ", contextClass.blocks)
          console.log("contextClass.levels : ", contextClass.levels)
          console.log("contextClass.rooms : ", contextClass.rooms)


          contextClass.levelList = result.levelList;
          console.log("levellist : ", contextClass.levelList)
      }

      
      f(contextClass);

    }

    var updateListLauncher = async function(contextClass, sensors) {
      let res = await sensorControllerBinder(sensors, contextClass.dbRetrieverService) as B;
      contextClass.sensorsControl = res.sensorsControl;
      contextClass.availableSensors = res.availableSensors;
      updateLists(contextClass);   
    }

    var sensorControllerBinder = function(sensors, dbRetrieverService) {

      return new Promise(resolve => { 
        var counter = 0;
        var availableSensors = [];
        var sensorsControl = [];
        sensors.forEach(element => {
          var sensor = new Sensor(element.name, element.idSensor, element.position, undefined, undefined, element.measurement);
          var posId = element.position.idLocation;
          dbRetrieverService.getSpecificLocation(posId).subscribe(location => {
            var loc = JSON.parse(JSON.stringify(location));
            sensor.positionName = loc.name + ' | ' + loc.room;
            sensor.location = loc;
            availableSensors.push(sensor);
            sensorsControl.push({'sensor': sensor, 'selected': false}); 
            counter ++;
            if(counter == (sensors.length)) {
              resolve({availableSensors, sensorsControl});
            }
          });


      });  
    });
    }
    this.availableSensors = [];
    var sensors = this.route.snapshot.data['sensors'];
    updateListLauncher(this,  sensors);
  }

  updateSensor(sensor: Sensor, selected: boolean) {

    console.log("Selected sensor ", sensor.name, " : ", selected);

  }

  updateLevel(level: string, selected: boolean) {

    console.log("Selected level ", level, " : ", selected);

  }

  updateBlock(block: string, selected: boolean) {

    console.log("Selected block ", block, " : ", selected);

  }

  updateRoom(room: string, selected: boolean) {

    console.log("Selected room ", room, " : ", selected);

  }

  testSelection() {
    console.log("changed a dropdown");
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


    this.sensorsControl.forEach( element=> {
      var e = element as SensorControlObject;
      if ( e.selected ) {
        this.selectedSensors.push(e.sensor);
      }      
    });

    console.log("Selected Sensors: " , this.selectedSensors);
  }

  

  

//   selectAllSensors() {

//     console.log("Select all sensors : " , this.selectAll);

//     for( var i= 0 ; i < this.sensorsControl.length; i ++) {
//       this.sensorsControl[i].selected = this.selectAll;
//       this.checkSelectedLocation(this.sensorsControl[i].sensor.position.idLocation, this.sensorsControl[i].selected);
//     }

//     console.log(this.sensorsControl);

//   }

//   checkSensors() {

//     this.selectAll = this.sensorsControl.every(function(item:any) {
//       return item.selected == true;
//     });

//   }

//   checkSelectedLocation(locationId: string, selected: boolean) {

//     var checkRooms = function (block: Block, locationId: string, selected: boolean ) {
//       return new Promise(resolve => {

//         var allSelected: boolean = true;

//         block.rooms.forEach((room, index) => {
//           console.log(" ------------> checking room : ", room, " for location ", locationId);
      
//           // check sensors list

//           if( room.locationId == locationId) {
//             room.selected = selected;
//             console.log(" ------------> Found location !"); 
//           } else {
//             allSelected = false;
//           }

//           if( index == (block.rooms.length -1)){
//             /*allSelected = this.room.sensors.every(function(sensor:any) {
//               return sensor.selected == true;
//             });
//             console.log(" --------------- > returning  ! : ", allSelected);*/
//             resolve(allSelected);
//           }

//         });
//       });
//     }


//     var blk = function (block: Block, locationId: string, selected: boolean) {

//       var f = async function(resolve) {

//         let result = await checkRooms(block, locationId, selected);
        
//         console.log(" ------> Rooms checked ! result : ", result);
//         block.selected = result as boolean;
//         resolve(result); 

//       }

//       return new Promise(resolve => f(resolve));

//     }    

//     var checkBlocks = function (level, locationID, selected: boolean) {
//       return new Promise(resolve => {

//         var allSelected: boolean = true;

//         var f = async function (block, index)  {
//           console.log(" ------> checking block  ", block, " for location ", locationId);
//           let res =  await blk(block,locationID, selected);

//           if( index == (level.blocks.length -1)){
//             allSelected = res as boolean;
//             resolve(allSelected);
//           }
//         }

//         level.blocks.forEach((block, index) => f(block, index));

//       });
//     }

//     var lv = function (level: Level, locationId: string, selected: boolean) {

//       var f = async function(resolve) {
//         let result = await checkBlocks(level, locationId, selected);
//         console.log(" ---> Blocks checked ! result : ", result);
//         level.selected = result as boolean;
//         resolve(result);
//       }

//       return new Promise(resolve => f(resolve));

//     }

//     var f = async function(level, locationId, selected: boolean) {
//       console.log(" ---> checking level  ", level, " for location ", locationId);
//       let res = await lv(level, locationId, selected);
//         console.log("Selected level : ", res);
//     }

//     console.log("Adesso devo controllare tutte le location");
//     this.locationList.forEach(level => f(level, locationId, selected));

//     //this.checkSensors();

//   }



  

//   selectLevel(selected: boolean, levelIndex: string){

//     this.locationList[levelIndex].blocks.forEach(block => {

//       block.selected = selected;
//       block.rooms.forEach(room => {

//         room.selected = selected;
//         this.selectRoom(selected, room.locationId);
        
//       });
      
//     });
    
//   }

//   selectBlock(selected: boolean, levelIndex: string, blockIndex: string){

//     this.locationList[levelIndex].blocks[blockIndex].rooms.forEach(room => {

//       room.selected = selected;
//       this.selectRoom(selected, room.locationId);
      
//     });
//   }

//   selectRoom(selected: boolean, locationId: string){

// /*     this.sensorsControl.forEach(element => {
//       if (element.sensor.position.idLocation == locationId){
//         element.selected = selected;
//       }
//     });
//  */
//     for(var i = 0; i < this.sensorsControl.length; i++) {
//       if (this.sensorsControl[i].sensor.position.idLocation == locationId){
//         this.sensorsControl[i].selected = selected;
//       }
//     }
//     this.checkSensors();
//   }

}
