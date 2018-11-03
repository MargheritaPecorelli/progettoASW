import { Sensor } from "./sensor.model";

export class ChartData {

    constructor(
        public name: string,
        public range: string, 
        public aggregationRange: string, 
        public aggregationType: string,
        public usedSensors: string[],
        public data: Object ) {
            console.log("ChartData created : ");
            console.log("name : " , this.name);
            console.log("data : " , data);
         }

    // addData(data: Number): void {
    //     this.data.push(data);
    // }

    // addUsedSensor(sensor: string) {
    //     this.usedSensors.push(sensor);
    // }

    getXValue(): Number[] {
        // var list : string [] = ['t1', 't2', 't3', 't4', 't5'];
        // return list;
        //TODO: recuperare dati dal db in base alla misurazione (name) e al range specificato e ai sensori 
        // TODO: restituita in base all'aggregazione specificata ( con un switch )
        // switch(aggregationRange) {
        //     case "last week": {
        //       
        //       break
        //     }
        //     case "last 30 days": {
        //       
        //       break
        //     }
        //     default: {
        //       console.log("Invalid choice");  
        //       break; 
        //    } 
        //   }
        var timeList = [];
        var dataJson = JSON.parse(JSON.stringify(this.data));
        Object.keys(dataJson).forEach(element => {
            var entry = dataJson[element].data;
            Object.keys(entry).forEach(elem => {
                timeList.push(entry[elem].timestamp);
            });
        });
        console.log(timeList);
        return timeList
    }
    
    getData(): string[] {
        // var list : string [] = ['t1', 't2', 't3', 't4', 't5'];
        // return list;
        //TODO: recuperare dati dal db in base alla misurazione (name) e al range specificato e ai sensori 
        // TODO: restituita in base all'aggregazione specificata ( con un switch )

        var dataList = [];
        var dataJson = JSON.parse(JSON.stringify(this.data));
        Object.keys(dataJson).forEach(element => {
            var entry = dataJson[element].data;
            Object.keys(entry).forEach(elem => {
                dataList.push(entry[elem].value);
            });
        });
        console.log(dataList);
        return dataList
    }






}
    