import { Injectable } from '@angular/core';

import { Resolve, ActivatedRouteSnapshot } from '@angular/router';

import { DataRetrieverService } from '../services/data-retriever.service';
import { Observable } from 'rxjs';
import { Location } from '../models/location.model';

@Injectable()
export class LocationsResolver implements Resolve<Location[]> {

  constructor(private dbRetrieverService: DataRetrieverService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
      
    return this.dbRetrieverService.getAllLocations();

  }

}