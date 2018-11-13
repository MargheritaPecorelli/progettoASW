import { Location } from './location.model'
export class Sensor {

    constructor(
        public name: string, 
        public id : string, 
        public position: Object, 
        public positionName: string,
        public location: Location,
        public measurements: Object[]) { }

}