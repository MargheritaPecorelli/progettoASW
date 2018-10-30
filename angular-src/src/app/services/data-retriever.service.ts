import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class DataRetrieverService {

  constructor(private http: HttpClient) { }

  getSensors() {
    return this.http.get('http://localhost:3000/api/sensors');
  }

  getSensorData() {
    //TODO: da sistemare
    return this.http.get('http://localhost:3000/api/sensors');
  }
}
