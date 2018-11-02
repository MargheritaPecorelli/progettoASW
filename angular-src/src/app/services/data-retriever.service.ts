import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class DataRetrieverService {

  constructor(private http: HttpClient) {
  }

  getSensors() {
    return this.http.get('http://localhost:3000/api/sensors');
  }
  
  getMeasurements() {
    return this.http.get('http://localhost:3000/api/measurements');
  }  

  getSensorDataWithDate(measurement: string, start: Date, end: Date) {
    // start: 2017-11-11 11:00
    // end: 2019-11-11 11:00
    console.log(start);
    console.log(end);
    // var startDate : Date = new Date(start);
    // var endDate : Date = new Date(end);
    new Date(2010, 6, 26).getTime() / 1000
    var startDate : Date = new Date("2017-11-11 11:00");
    var endDate : Date = new Date("2019-11-11 11:00");
   
    console.log(startDate);
    console.log(endDate);
    var today : Date = new Date();
    console.log(today);

    // if(endDate.getDate() > today.getDate() || endDate.getDate() <= startDate.getDate()) {
    //   throw "ERROR: WRONG DATE!!";
    // }

    var path = 'http://localhost:3000/api/sensors/measurement/data?measurementType=' + measurement + '&start='+ startDate + '&end=' + endDate;
    // var richiesta = this.http.get(path);
    console.log('path ' + path);
    return this.http.get(path);
  }
  
  getSensorDataWithRange(measurement: string, range: string) {
    var start : Date = new Date();
    var end : Date;

    switch(range) {
      case "Last Week": {
        end = new Date();
        start.setDate(end.getDate() - 7);
        break
      }
      case "last 30 days": {
        end = new Date();
        start.setDate(end.getDate() - 30);
        break
      }
      default: {
        console.log("Invalid choice");  
        break; 
      } 
    }

    return this.getSensorDataWithDate(measurement, start, end);
  }
}
