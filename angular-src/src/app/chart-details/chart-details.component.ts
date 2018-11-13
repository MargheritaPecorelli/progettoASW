import { Component, OnInit, Testability } from '@angular/core';
import { ActivatedRoute, Params, NavigationEnd, Router } from '@angular/router';
import { ChartData } from '../models/chartdata.model';
import { Sensor } from '../models/sensor.model';
import { Location } from '../models/location.model';
import { DataRetrieverService } from '../services/data-retriever.service';
import { Subject, Subscription } from 'rxjs';

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
  sensorsControl,
  sensorsAllList
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

  availableChartType: string[] = ['line','bar','radar','doughnut', 'pie', 'polarArea', 'bubble', 'scatter'];
  //TODO: add label to select x days.
  availableAggregationRange: string[] = ['aggregation on hours','aggregation on days','aggregation on months','aggregation every X days', 'aggregation on day and night', 'aggregation of every value', 'every value (without aggregation)'];
  availableAggregationType: string[] = ['all values', 'average','min','max','moda'];

  // {measurement: 'pressure', range: 'last 30 days' },
    // {measurement: 'pressure', range: 'last 30 days' },
    // {measurement: 'pressure', range: 'last 30 days' },
    // {measurement: 'temperature', range: 'last 30 days' },
    // {measurement: 'temperature', range: 'last 30 days' },
    // {measurement: 'temperature', range: 'last 30 days' },
    // {measurement: 'temperature', range: 'last 30 days' }
  
  //todo: retrieve default sensor;
  selectedSensors: Sensor[] = [];
  ///////////////// Sensors selection modal ////////////
//  sensorsControl: SensorControlObject[] = [];
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
  sensorsAllList: Sensor[];


  //TODO: FILTER FOR AVAILABLE MEASUREMENT ?
  
  sensorsList: Sensor[];

  chartUpdater: Subject<ChartData> = new Subject();

  chartSubscription: Subscription;

  reload : boolean;

  constructor(private route: ActivatedRoute, private dbRetrieverService: DataRetrieverService, private router: Router ) {
    
    var sensors = this.route.snapshot.data['sensors'];

    var defaultData: any = {
      measurement: 'pressure', 
      range: 'last 30 days', 
      aggregationRange: 'every value', 
      aggregationType: null, 
      usedSensors: sensors
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

    this.selectedSensors = defaultData.usedSensors;
    console.log("default selected sensors", this.selectedSensors);

    this.navigationSubscription = this.router.events.subscribe((e: any) => {
      if (e instanceof NavigationEnd) {
        this.initialiseInvites();
      }
    });

  }

  ngOnInit() {
    this.updateModalData();
  }

 navigationSubscription;

 initialiseInvites() {
   console.log("Mi sto ricaricando !");

 }

 ngOnDestroy() {
    // avoid memory leaks here by cleaning up after ourselves. If we  
    // don't then we will continue to run our initialiseInvites()   
    // method on every navigationEnd event.
    if (this.navigationSubscription) {  
       this.navigationSubscription.unsubscribe();
    }
  }


  

  private updateModalData() {
    console.log("this.updateModalData dentro ngOnInit")
    
    var updateLists = function(contextClass) {

      var createTree = function (sensorsList, sensorsControl) {
        var toReturn: A = {rooms: {}, blocks: {}, levels: {}, levelList: []};

        return new Promise(resolve => { 
            // sensorsControl.forEach(control => {
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
              
              // });
         });
        }
    
      var f = async function(contextClass)  {
          let result = await createTree(contextClass.sensorsList, contextClass.sensorsControl) as A;

          contextClass.levels = result.levels
          contextClass.blocks = result.blocks
          contextClass.rooms = result.rooms  
          
          contextClass.levelList = result.levelList;
      }

      
      f(contextClass);

    }

    var updateListLauncher = async function(contextClass, sensors) {
      let res = await sensorControllerBinder(sensors, contextClass.dbRetrieverService, contextClass.id) as B;
      contextClass.sensorsControl = res.sensorsControl;
      contextClass.sensorsList = res.sensorsList;
      contextClass.sensorsAllList = res.sensorsAllList;
      updateLists(contextClass);   
    }



    var sensorControllerBinder = function(sensors, dbRetrieverService, measurementType: string) {

      return new Promise(resolve => { 
        var counter = 0;
        var sensorsList = [];
        var sensorsAllList = [];
        var sensorsControl = {};
        sensors.forEach(element => {
          var sensor = new Sensor(element.name, element.idSensor, element.position, undefined, undefined, element.measurements);
          var posId = element.position.idLocation;
          dbRetrieverService.getSpecificLocation(posId).subscribe(location => {
            var loc = JSON.parse(JSON.stringify(location));
            sensor.positionName = loc.name + ' | ' + loc.room;
            sensor.location = loc//new Location(loc.idLocation, loc.name, loc.room, loc.block, loc.level, loc.campus, loc.city);
            sensorsList.push(sensor.id);
            sensorsAllList.push(sensor.id);
            sensorsControl[sensor.id] = {'sensor': sensor, 'selected': false}; 
            counter ++;
            if(counter == (sensors.length)) {
              resolve({sensorsList, sensorsControl, sensorsAllList});
            }
          });


      });  
    });
    }
    this.sensorsList = [];
    // this.selectedSensors = [];
    var sensors = this.route.snapshot.data['sensors'];

    // sensors.forEach(sensor => {
    //   this.selectedSensors.push(sensor);
    // });
    updateListLauncher(this, sensors);
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
    this.chartData.type = chartType;
    this.updateChart();

  }

  onChangeAggregationTypeValue(aggregation: string) {

    if (aggregation == 'all values'){
      aggregation = null;
    }

    console.log("Aggregation type selected: " , aggregation);
    this.chartData.aggregationType = aggregation;
    this.retrieveDataAndUpdate();
    
  }

  onChangeAggregationRangeValue(range: string) {

    if( range == 'every value (without aggregation)'){
      range = 'every value';
    }

    console.log("Aggregation range selected: " , range);
    this.chartData.aggregationRange = range;
    this.retrieveDataAndUpdate();

  }

  private retrieveDataAndUpdate() {
    console.log(" ---> retrieving new data ! ");
    if(this.type == 'm'){
      console.log(" -----> retrieving measurement data ! ");
      var sensors: string[] = [];
      for ( let i = 0; i < this.selectedSensors.length; i ++ ) {
        console.log(" -------> retrieving sensor info ! ", this.selectedSensors[i].id);
        sensors.push(this.selectedSensors[i].id);
      }

      console.log(" ---------> calling db  ! ");

      this.dbRetrieverService.getValuesOfSomeSensorsMeasurementThroughRange(sensors, this.id, this.chartData.range).subscribe(response => {
        console.log(" -----------> db response  ! ", response);
        this.chartData.data = response;
        this.updateChart();
      });

    } else if (this.type == 's'){
      console.log(" -----> retrieving sensor data ! ");
      this.dbRetrieverService.getSensorValuesThroughRange(this.id,this.chartData.range).subscribe(response => {
        this.chartData.data = response;
        this.updateChart();
      })
    }

  }

  private updateChart(){
    console.log("updating chart !");
    this.chartUpdater.next(this.chartData);
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

  //   console.log("Select all sensors : " , this.selectAll);

  //   for( var i= 0 ; i < this.sensorsControl.length; i ++) {
  //     this.sensorsControl[i].selected = this.selectAll;
  //     this.checkSelectedLocation(this.sensorsControl[i].sensor.position.idLocation, this.sensorsControl[i].selected);
  //   }

  //   console.log(this.sensorsControl);

  // }

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
