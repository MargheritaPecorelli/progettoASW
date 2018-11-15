import { Component, OnInit, Output, EventEmitter } from '@angular/core';
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

interface DateRange{
  start: Date,
  end: Date
}

// interface Level {
//   id: string,
//   name: string,
//   blocks: Block[],
//   selected: boolean
// }

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
  dateUpdater: Subject<string> = new Subject();
  availableChartType: string[] = ['line','bar','radar','doughnut', 'pie', 'polarArea'];
  //TODO: add label to select x days.
  availableAggregationRange: string[] = ['aggregation on hours','aggregation on days','aggregation on months', 'aggregation of every value', 'every value (without aggregation)'];
  availableAggregationType: string[] = ['average','min','max','moda'];

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
  sensorsControl: Object = {};

  levels: Object = {};
  rooms: Object = {};
  blocks: Object = {};
  ///////////////////

  type: string;
  id: string;

  realtime: boolean = false;
  selectAll: boolean = false;

  receivedData: Object;

  levelList: Array<string>;

  chartData: ChartData;
  
  chartDataList: Array<ChartData>;

  defaultData : any;

  //TODO: FILTER FOR AVAILABLE MEASUREMENT ?
  
  sensorsList: Sensor[];

  chartUpdater: Subject<ChartData> = new Subject();

  chartUpdaterList : Array<Subject<ChartData>> = [];

  chartSubscription: Subscription;
  routeSubscription;
  allMeasurements;

  constructor(private route: ActivatedRoute, private dbRetrieverService: DataRetrieverService, private router: Router ) {
    this.chartDataList = [];
    var sensors = this.route.snapshot.data['sensors'];
    this.allMeasurements = this.route.snapshot.data['measurements'];
    console.log(this.dateUpdater);
    this.defaultData = {
      measurement: 'pressure', 
      range: 'last 30 days', 
      aggregationRange: 'every value', 
      aggregationType: 'average', 
      usedSensors: sensors
    }

    this.routeSubscription = this.route.params.subscribe(params => {
      this.resetAllFields();
      this.update(params);
    });

    this.receivedData = this.route.snapshot.data['data'];
    console.log(" ------------------> Received chart receivedData : " , this.receivedData);

    if(this.type == 's') {
      var l = this.receivedData as Array<JSON>;
      var list = [];
      for(var t = 0; t < l.length; t ++) {
        list.push(l[t]);
      }
      var json = {id: this.id, data: list};
      var da = [];
      da.push(json);
      this.receivedData = da;
      // console.log(" ------------------> Received chart receivedData : " , this.receivedData);
    }

    console.log(" ------------------> Received chart receivedData : " , this.receivedData);

    // // var measurements = 
    // this.dbRetrieverService.getAllMeasurements().subscribe(measurements => {
    //   // var js = JSON.parse(JSON.stringify(measurements));
    //   var js = JSON.stringify(measurements);
    //   console.log('measurements ' + js);
    //   this.chartData = new ChartData(
    //     measurements,
    //     defaultData.aggregationType + " " + defaultData.measurement,
    //     defaultData.range,
    //     null,
    //     null, 
    //     defaultData.aggregationRange,
    //     defaultData.aggregationType,
    //     null,
    //     defaultData.usedSensors,
    //     this.receivedData
    //   ) ;
    // })

    

    if(this.type == 's') {
      var finalList = this._getAllMeasurementsListOfASensor(this.receivedData);
      this.chartUpdaterList = [];
      for(var w = 0; w < finalList.length; w++) {
        this.chartDataList.push(new ChartData(
          this.defaultData.aggregationType + " " + this.defaultData.measurement,
          this.defaultData.range,
          null,
          null, 
          this.defaultData.aggregationRange,
          this.defaultData.aggregationType,
          null,
          this.defaultData.usedSensors,
          finalList[w]
        ));
        this.chartUpdaterList.push(new Subject());
      }
    } else {
      this.chartData = new ChartData(
        this.defaultData.aggregationType + " " + this.defaultData.measurement,
        this.defaultData.range,
        null,
        null, 
        this.defaultData.aggregationRange,
        this.defaultData.aggregationType,
        null,
        this.defaultData.usedSensors,
        this.receivedData
      );
    }
    
    console.log(" ------------------> Generated Chart Data : " , this.chartData);
  }
  
  private update(params) {
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
                                                                selected: true};
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
                                            selected: true};
            }  


            if (toReturn.levels[control.sensor.location.level] ) {
              if (!toReturn.levels[control.sensor.location.level].blocks.includes(blockID)){
                toReturn.levels[control.sensor.location.level].blocks.push(blockID);
              }
            } else {
              toReturn.levels[control.sensor.location.level] = { id: control.sensor.location.level, 
                                                                  name: 'Level ' + control.sensor.location.level, 
                                                                  blocks: [blockID], 
                                                                  selected: true};
              toReturn.levelList.push(control.sensor.location.level)

            }  
          }
          resolve(toReturn);
        });
      }
    
      var f = async function(contextClass)  {
          let result = await createTree(contextClass.sensorsList, contextClass.sensorsControl) as A;

          contextClass.levels = result.levels;
          contextClass.blocks = result.blocks;
          contextClass.rooms = result.rooms;
          contextClass.selectAll = true;
          contextClass.initialiseSelectedSensorsList();
          contextClass.retrieveDataAndUpdate();
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
              sensorsControl[sensor.id] = {'sensor': sensor, 'selected': true}; 
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
  }

  ngOnInit() {
  }

  ngOnDestroy(){
    this.routeSubscription.unsubscribe();
    // this.chartSubscription.unsubscribe();
  }

  resetAllFields() {
    this.dateUpdater.next("reset");
  }

  updateSensor(sensor: Sensor, selected: boolean) {
    this.checkRoomAndUpdate(sensor.location);
  }

  checkSelectAll() {
    var allSelected = true;
    for(var i = 0; i < this.levelList.length ; i++ ){
      allSelected = allSelected && this.levels[this.levelList[i]].selected
    }
    this.selectAll = allSelected
  }

  checkLevelAndUpdate(location: Location){
    var allSelected = true;
    var levelSelected = this.levels[`${location.level}`];

    var blockList = levelSelected.blocks;
    for(var i = 0; i < blockList.length ; i++ ){
      allSelected = allSelected && this.blocks[`${blockList[i]}`].selected
    }
    levelSelected.selected = allSelected
    this.checkSelectAll()
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

  onChangeDateRange(event) {
    this.chartData.startDate = (event as DateRange).start;
    this.chartData.startDate.setHours(0)
    this.chartData.endDate = (event as DateRange).end;
    console.log(this.chartData);
    this.retrieveDataAndUpdate();
  }

  onChangeChartType(chartType: string){

    console.log("Chart type selected: " , chartType);
    if(this.type == 's') {
      for(var i = 0; i < this.chartDataList.length; i++) {
        this.chartDataList[i].type = chartType;
      }
    } else {
      this.chartData.type = chartType;
    }
    this.updateChart();

  }

  onChangeAggregationTypeValue(aggregation: string) {

    // if (aggregation == 'all values'){
    //   aggregation = null;
    // }

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

  private async retrieveDataAndUpdate() {
    console.log(" ---> retrieving new data ! ");
    if(this.type == 'm'){
      if(!this.chartData) {
        this.chartData = new ChartData(
          this.defaultData.aggregationType + " " + this.defaultData.measurement,
          this.defaultData.range,
          null,
          null, 
          this.defaultData.aggregationRange,
          this.defaultData.aggregationType,
          null,
          this.defaultData.usedSensors,
          this.receivedData
        );
      }
      console.log(" -----> retrieving measurement data ! ");
      var sensors: string[] = [];
      for(let i = 0; i < this.selectedSensors.length; i++) {
        console.log(" -------> retrieving sensor info ! ", this.selectedSensors[i].id);
        sensors.push(this.selectedSensors[i].id);
      }
      console.log(" ---------> calling db  ! ");
      if (sensors.length != 0 ) {
        this.dbRetrieverService.getValuesOfSomeSensorsMeasurementThroughStartAndEnd(sensors, this.id, this.chartData.startDate, this.chartData.endDate).subscribe(response => {
        //this.dbRetrieverService.getValuesOfSomeSensorsMeasurementThroughRange(sensors, this.id, this.chartData.range).subscribe(response => {
          console.log(" -----------> db response  ! ", response);
          this.chartData.data = response;
          this.updateChart();
        });
      } else {
        this.chartData.data = []
        this.updateChart();
      }
    } else if (this.type == 's'){
      console.log(" -----> retrieving sensor data ! ");
      var newStartDate;
      var newEndDate ;
      if(this.chartDataList.length == 0) {
        if(this.chartData) {
          newStartDate = this.chartData.startDate;
          newEndDate = this.chartData.endDate;
        } else {
          newStartDate = new Date();
          newEndDate = new Date();
          newStartDate.setDate(newStartDate.getDate() - 29);
          newEndDate.setHours(newEndDate.getHours() - 2);
        }
      // } else if(this.chartDataList.length < this.allMeasurements.length) {
      //   newStartDate = this.chartDataList[0].startDate;
      //   newEndDate = this.chartDataList[0].endDate;
      //   this.chartDataList = [];
      //   this.chartUpdaterList = [];
      //   // var measurements = this.route.snapshot.data['measurements'];
      //   for(var w = 0; w < this.allMeasurements.length; w++) {
      //     this.chartUpdaterList.push(new Subject());
      //     this.chartDataList.push(new ChartData(
      //       this.defaultData.aggregationType + " " + this.defaultData.measurement,
      //       this.defaultData.range,
      //       null,
      //       null, 
      //       this.defaultData.aggregationRange,
      //       this.defaultData.aggregationType,
      //       null,
      //       this.defaultData.usedSensors,
      //       this.receivedData
      //     ));
      //   }
      //   console.log(" ------------------> this.chartDataList : " , this.chartDataList);
      } else {
        newStartDate = this.chartDataList[0].startDate;
        newEndDate = this.chartDataList[0].endDate;
      }
      this.dbRetrieverService.getSensorValuesThroughStartAndEnd(this.id, newStartDate, newEndDate).subscribe(response => {
        var finalList = this._getAllMeasurementsListOfASensor(response);
        console.log(" ------------------> final list : " , finalList);

        if(finalList.length == 0) {
          this.chartUpdaterList = [];
          this.chartDataList = [];
          this.chartUpdaterList.push(new Subject());
          this.chartDataList.push(new ChartData(
            this.defaultData.aggregationType + " " + this.defaultData.measurement,
            this.defaultData.range,
            null,
            null, 
            this.defaultData.aggregationRange,
            this.defaultData.aggregationType,
            null,
            this.defaultData.usedSensors,
            []
          ));
          console.log(" ------------------> this.chartDataList : " , this.chartDataList);
          this.updateChart();

        } else {
          console.log(" ------------------> final list : " , finalList);
          this.chartDataList = [];
          this.chartUpdaterList = [];
          console.log(" ------------------> final list length : " , finalList.length);
          console.log(" ------------------> this.chartDataList : " , this.chartDataList);
          console.log(" ------------------> this.chartDataList length : " , this.chartDataList.length);
          for(var t = 0; t < finalList.length; t++) {
            this.chartDataList.push(new ChartData(
              this.defaultData.aggregationType + " " + this.defaultData.measurement,
              this.defaultData.range,
              null,
              null, 
              this.defaultData.aggregationRange,
              this.defaultData.aggregationType,
              null,
              this.defaultData.usedSensors,
              finalList[t]
            ));
            this.chartUpdaterList.push(new Subject());
          }
          console.log(" ------------------> this.chartDataList : " , this.chartDataList);
          console.log(" ------------------> this.chartDataList length : " , this.chartDataList.length);
          console.log(" ------------------> final list length : " , finalList.length);
          for(var q = 0; q < finalList.length; q++) {
            console.log(" ------------------> q : " , q);
            console.log(" ------------------> finalList[q] : " , finalList[q]);
            this.chartDataList[q].data = finalList[q];
            console.log(" ------------------> this.chartDataList[q].data : " , this.chartDataList[q].data);
          }
          console.log(" ------------------> this.chartDataList : " , this.chartDataList);
          this.updateChart();
        }

      });
    }
  }

  private async updateChart(){
    console.log("updating chart !");
    if (this.type == 's') {
      console.log(" ------------------> this.chartDataList : " , this.chartDataList);
      console.log(" ------------------> this.chartUpdaterList : " , this.chartUpdaterList);
      for(var t = 0; t < this.chartDataList.length; t++) {  
      this.chartUpdaterList[t].next(this.chartDataList[t]);
      }
    } else {
      this.chartUpdater.next(this.chartData);
    }
  }



  ////////////////// Sensor Selector Modal ///////////////////////

  initialiseSelectedSensorsList() {

    this.selectedSensors = [];


    this.sensorsList.forEach( element=> {
      var e = this.sensorsControl[`${element}`] as SensorControlObject;
      if ( e.selected ) {
        this.selectedSensors.push(e.sensor);
      }      
    });
  }

  submitModal() {
    this.initialiseSelectedSensorsList();
    this.retrieveDataAndUpdate();
    console.log("Selected Sensors: " , this.selectedSensors);
  }

  selectAllSensors(selected: boolean) {
    this.levelList.forEach(levelName => {
      this.updateLevel(levelName, selected);
    });
  }

  _getAllMeasurementsListOfASensor(receivedData) {
    var resultsList = [];
    var finalList = [];
    
    for(var i = 0; i < this.allMeasurements.length; i++) {
      resultsList.push([]);    
    }
    console.log(" ------------------> resultsList : " , resultsList);
    var jsonArr = receivedData as Array<JSON>;
    console.log(" ------------------> jsonArr : " , jsonArr);

    if(jsonArr.length != 0) {
      var allData;
      if(jsonArr.length > 1) {
        allData = jsonArr;
      } else {
        allData = JSON.parse(JSON.stringify(jsonArr[0])).data;
      }
      console.log(" ------------------> allData : " , allData);
      for(var y = 0; y < allData.length; y++) {
        var entry = JSON.parse(JSON.stringify(allData[y]));
        for(var k = 0; k < this.allMeasurements.length; k++) {
          if(entry.measurementType === JSON.parse(JSON.stringify(this.allMeasurements[k])).measurementType) {
            resultsList[k].push(entry);
          }
        }        
      }
      console.log(" ------------------> List of lists, one for every measurements : " , resultsList);
      for(var e = 0; e < resultsList.length; e++) {
        if(resultsList[e].length != 0) {
          finalList.push(resultsList[e])
        }
      }
      console.log(" ------------------> List of lists, one for every measurements (except the empty ones) : " , finalList);
    }

    return finalList;
  }
}