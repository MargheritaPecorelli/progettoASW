export class ChartData {
    
    name : string;
    range: string;
    aggregation: string;
    usedSensors: [string];
    data : [Number];

    constructor(name: string) { 
        this.name = name;
        this.range = "25/10/2018 12:00 - Now";
        this.aggregation = "1 Hour Average";
        this.usedSensors = ["all"];
        this.data = [42];
    }

    addData(data: Number): void {
        this.data.push(data);
    }

    addUsedSensor(sensor: string) {
        this.usedSensors.push(sensor);
    }


}
    