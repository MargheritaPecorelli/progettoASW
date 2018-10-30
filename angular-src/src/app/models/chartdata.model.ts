import { Sensor } from "./sensor.model";

export class ChartData {

    constructor(
        public name: string,
        public range: string, 
        public aggregationRange: string, 
        public aggregationType: string,
        public usedSensors: string[],
        public data: Number[] ) { }

    addData(data: Number): void {
        this.data.push(data);
    }

    addUsedSensor(sensor: string) {
        this.usedSensors.push(sensor);
    }

    getXValue(): string[] {
        var list : string [] = ['t1', 't2', 't3', 't4', 't5'];
        return list;
        //TODO: recuperare dati dal db in base alla misurazione (name) e al range specificato e ai sensori 
        // TODO: restituita in base all'aggregazione specificata ( con un switch )
    }




}
    