import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class DataRetrieverService {

  constructor(private http: HttpClient) {}


  /** SENSORS */
  
  getAllSensors() {
    return this.http.get(`http://localhost:3000/api/sensors`);
  }
    
  

  /** SENSOR */
  
  postNewSensor(sensorId: string, sensorName: string, sensorMeasurements: string, sensorPosition: string) {
    // examples:
    // measurements: {"measurementType": "temperature", "uom": "C"}; {"measurementType": "pressure", "uom": "Pa"}
    // position: {"latitude": 3, "longitude": 4, "elevetion": 5, "idLocation": "L1"}
    var result = this.http.post(`http://localhost:3000/api/sensor`, 
      {
        idSensor: sensorId,
        name: sensorName,
        measurements: sensorMeasurements,
        position: sensorPosition
      });
    return result;
  }

  getSpecificSensor(idSensor: string) {
    return this.http.get(`http://localhost:3000/api/sensor?idSensor=${idSensor}`);
  }
  
  deleteSpecificSensor(idSensor: string) {
    return this.http.delete(`http://localhost:3000/api/sensor?idSensor=${idSensor}`);
  }
  
  putNewSensorPosition(sensorId: string, sensorPosition: string) {
    // examples:
    // position: {"latitude": 10, "longitude": 4, "elevetion": 7, "idLocation": "L1"}
    return this.http.put(`http://localhost:3000/api//sensor/position`,
    {
      idSensor: sensorId,
      position: sensorPosition
    });
  }
  
  putNewSensorMeasurement(sensorId: string, sensorMeasurement: string) {
    // examples:
    // measurements: {"measurementType": "pm", "uom": "mg/m^3"}
    return this.http.put(`http://localhost:3000/api/sensor/measurement`,
    {
      idSensor: sensorId,
      measurement: sensorMeasurement
    });
  }


  /** USERS */

  getAllUsers() {
    return this.http.get(`http://localhost:3000/api/users`);
  }
  
  
  /** USER */
  
  postNewUser(userEmail: string, userName: string, userSurname: string, userAdmin: string) {
    // examples:
    // 'prova@gmail.com', 'marghe', 'peco', 'true'
    var result = this.http.post(`http://localhost:3000/api/user`, 
      {
        email: userEmail,
        name: userName,
        surname: userSurname,
        admin: userAdmin
      });
    return result;
  }
  
  getSpecificUser(email: string) {
    return this.http.get(`http://localhost:3000/api/user?email=${email}`);
  }
  
  deleteSpecificUser(email: string) {
    return this.http.delete(`http://localhost:3000/api/user?email=${email}`);
  }


  /** LOCATIONS */

  getAllLocations() {
    return this.http.get(`http://localhost:3000/api/locations`);
  }


  /** LOCATION */

  postNewLocation(locationId: string, locationName: string, locationRoom: string, locationBlock: string, locationLevel: string, locationCampus: string, locationCity: string) {
    // examples:
    // 'L2', 'Mirri\'s office', '1003', 'A', '4', 'cesena', 'cesena'
    var result = this.http.post(`http://localhost:3000/api/location`, 
      {
        idLocation: locationId,
        name: locationName,
        room: locationRoom,
        block: locationBlock,
        level: locationLevel,
        campus: locationCampus,
        city: locationCity
      });
    return result;
  }
  
  getSpecificLocation(idLocation: string) {
    return this.http.get(`http://localhost:3000/api/location?idLocation=${idLocation}`);
  }
  
  deleteSpecificLocation(idLocation: string) {
    return this.http.delete(`http://localhost:3000/api/location?idLocation=${idLocation}`);
  }


  /** SENSOR'S DATA */

  postNewSensorData(sensorId: string, dataValue: string, dataMeasurement: string, dataTimestamp: Date) {
    // examples:
    // var date = new Date();
    // 'A1', '26', 'pressure', date
    var result = this.http.post(`http://localhost:3000/api/sensor/data`, 
      {
        idSensor: sensorId,
        value: dataValue,
        measurementType: dataMeasurement,
        timestamp: dataTimestamp
      });
    return result;
  }
  
  getSensorValues(idSensor: string, start: Date, end: Date) {
    // examples:
    // var endDate = new Date(); -> mi dice che è nel futuro: è un'ora avanti (oppure p dataOperations ad essere un'ora indietro)
    // var startDate = new Date(endDate.getDate() -7);
    // 'A1', startDate, endDate
    return this.http.get(`http://localhost:3000/api/sensor/data?idSensor=${idSensor}&start=${start}&end=${end}`);
  }
  
  getSomeValuesOfSpecificSensorMeasurement(idSensor: string, measurementType: string, start: Date, end: Date) {
    // examples:
    // var endDate = new Date(); -> mi dice che è nel futuro: è un'ora avanti (oppure p dataOperations ad essere un'ora indietro)
    // var startDate = new Date(endDate.getDate() -7);
    // 'A1', 'presssure', startDate, endDate
    return this.http.get(`http://localhost:3000/api/sensors/measurement/data?idSensor=${idSensor}&measurementType=${measurementType}&start=${start}&end=${end}`);
  }
  

  getValuesOfSpecificMeasurementThroughStartAndEnd(measurementType: string, start: Date, end: Date) {
    // examples:
    // var endDate = new Date(); -> mi dice che è nel futuro: è un'ora avanti (oppure p dataOperations ad essere un'ora indietro)
    // var startDate = new Date(endDate.getDate() -7);
    // 'pressure', startDate, endDate
    return this.http.get(`http://localhost:3000/api/sensors/measurement/data?measurementType=${measurementType}&start=${start}&end=${end}`);
  }
  
  getValuesOfSpecificMeasurementThroughRange(measurement: string, range: string) {
    var start : Date = new Date();
    var end : Date;

    switch(range) {
      case "Last Week": {
        end = new Date();
        end.setHours(end.getHours() - 1);
        start.setDate(end.getDate() - 7);
        break
      }
      case "last 30 days": {
        end = new Date();
        end.setHours(end.getHours() - 1);
        start.setDate(end.getDate() - 30);
        break
      }
      default: {
        console.log("Invalid choice");  
        break; 
      } 
    }

    return this.getValuesOfSpecificMeasurementThroughStartAndEnd(measurement, start, end);
  }


  /** MEASUREMENTS */

  getAllMeasurements() {
    return this.http.get(`http://localhost:3000/api/measurements`);
  }


  postNewMeasurement(type: string, meseaurmentUom: string) {
    var result = this.http.post(`http://localhost:3000/api/measurement`, 
    {
      measurementType: type,
      uom: meseaurmentUom
    });
  return result;
  }

  getSpecificMeasurement(type: string) {
    return this.http.get(`http://localhost:3000/api/measurement?measurementType=${type}`);
  }
}
