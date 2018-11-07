import { Sensor } from "./sensor.model";
import { map } from "rxjs/internal/operators/map";

export class ChartData {

    constructor(
        public name: string,
        public range: string, 
        public startDate: Date,
        public endDate: Date,
        public aggregationRange: string, 
        public aggregationType: string,
        public usedSensors: string[],
        public data: Object ) {
            // console.log("ChartData created : ");
            // console.log("name : " , this.name);
            // console.log("data : " , data);
         }

    getDataAndTheirTimestamp(): JSON[] {
        var dataList = [];
        var allSensorsData = [];
        var nwData = this.data as Array<Array<JSON>>
        // console.log(nwData);

        for(var i = 0; i < nwData.length; i++) {
            var entry = JSON.parse(JSON.stringify(nwData[i]));
            for(var j = 0; j< entry.data.length; j++) {
                allSensorsData.push(entry.data[j]);
            }
        }
        allSensorsData.sort((a, b) => {
            var aTime = new Date(a.timestamp);
            var bTime = new Date(b.timestamp);
            return aTime.getTime()-bTime.getTime();
        });
        // console.log(allSensorsData);

        switch(this.aggregationRange) {
            case "every value": {
                allSensorsData.forEach(elem => {
                    var val = JSON.stringify(elem.value);
                    var valTime = JSON.stringify(elem.timestamp);
                    var str = '{\"value\": \"' + val + '\", \"timestamp\": ' + valTime + '}';
                    dataList.push(JSON.parse(str));
                });
                break
            }
            case "aggregation on the day": {
                var dataToAggregate = [];
                var day = new Date(allSensorsData[0].timestamp);
                
                allSensorsData.forEach(elem => {
                    var time = new Date(elem.timestamp);
                    if(time.getDate() == day.getDate()) {
                        dataToAggregate.push(elem.value);
                    } else {
                        var val = JSON.stringify(this._aggregate(dataToAggregate));
                        var valTime = JSON.stringify(day.getFullYear() + '-' + day.getMonth() + '-' + day.getDate());
                        var str = '{\"value\": \"' + val + '\", \"timestamp\": ' + valTime + '}';
                        dataList.push(JSON.parse(str));

                        day = new Date(time);
                        dataToAggregate = [];
                        dataToAggregate.push(elem.value);
                    }   
                });
                // questo è uguale all'else e serve per aggregare i dati dell'ultima data
                var val = JSON.stringify(this._aggregate(dataToAggregate));
                var valTime = JSON.stringify(day.getFullYear() + '-' + day.getMonth() + '-' + day.getDate());
                var str = '{\"value\": \"' + val + '\", \"timestamp\": ' + valTime + '}';
                dataList.push(JSON.parse(str));
                break
            }
            case "aggregation on the week": {
                var dataToAggregate = [];
                var startDayOfTheWeek = new Date(allSensorsData[0].timestamp);
                var endDayOfTheWeek = new Date();
                endDayOfTheWeek.setDate(startDayOfTheWeek.getDate() + 7);
                
                allSensorsData.forEach(elem => {
                    var time = new Date(elem.timestamp);
                    if(time.getDate() >= startDayOfTheWeek.getDate() && time.getDate() < endDayOfTheWeek.getDate()) {
                        dataToAggregate.push(elem.value);
                    } else {
                        var val = JSON.stringify(this._aggregate(dataToAggregate));
                        var valTime = JSON.stringify('from ' + startDayOfTheWeek.getFullYear() + '-' + (startDayOfTheWeek.getMonth()+1) + '-' + startDayOfTheWeek.getDate() + ' to ' + endDayOfTheWeek.getFullYear() + '-' + (endDayOfTheWeek.getMonth()+1) + '-' + endDayOfTheWeek.getDate());
                        var str = '{\"value\": \"' + val + '\", \"timestamp\": ' + valTime + '}';
                        dataList.push(JSON.parse(str));

                        startDayOfTheWeek = new Date(time);
                        endDayOfTheWeek = new Date(time);
                        endDayOfTheWeek.setDate(startDayOfTheWeek.getDate() + 7);
                        dataToAggregate = [];
                        dataToAggregate.push(elem.value);
                    }       
                });
                // questo è uguale all'else e serve per aggregare i dati dell'ultima data
                var val = JSON.stringify(this._aggregate(dataToAggregate));
                var valTime = JSON.stringify('from ' + startDayOfTheWeek.getFullYear() + '-' + (startDayOfTheWeek.getMonth()+1) + '-' + startDayOfTheWeek.getDate() + ' to ' + endDayOfTheWeek.getFullYear() + '-' + (endDayOfTheWeek.getMonth()+1) + '-' + endDayOfTheWeek.getDate());
                var str = '{\"value\": \"' + val + '\", \"timestamp\": ' + valTime + '}';
                dataList.push(JSON.parse(str));
                break
            }
            case "aggregation on the month": {
                var dataToAggregate = [];
                var startDayOfTheMonth = new Date(allSensorsData[0].timestamp);
                
                allSensorsData.forEach(elem => {
                    var time = new Date(elem.timestamp);
                    if(time.getMonth() == startDayOfTheMonth.getMonth()) {
                        dataToAggregate.push(elem.value);
                    } else {                        
                        var val = JSON.stringify(this._aggregate(dataToAggregate));
                        var valTime = JSON.stringify(startDayOfTheMonth.getFullYear() + '-' + (startDayOfTheMonth.getMonth()+1));
                        var str = '{\"value\": \"' + val + '\", \"timestamp\": ' + valTime + '}';
                        dataList.push(JSON.parse(str));

                        startDayOfTheMonth = new Date(time);
                        dataToAggregate = [];
                        dataToAggregate.push(elem.value);
                    }
                });
                // questo è uguale all'else e serve per aggregare i dati dell'ultima data
                var val = JSON.stringify(this._aggregate(dataToAggregate));
                var valTime = JSON.stringify(startDayOfTheMonth.getFullYear() + '-' + (startDayOfTheMonth.getMonth()+1));
                var str = '{\"value\": \"' + val + '\", \"timestamp\": ' + valTime + '}';
                dataList.push(JSON.parse(str));
                break
            }
            default: {
                console.log("Invalid choice");  
                break; 
            } 
        }
        // console.log(dataList);
        return dataList;
    }
    
    _aggregate(listOfData: number[]): string {
        var values;
        switch(this.aggregationType) {
            case "max": {
                listOfData.sort(function(a, b){return b-a});
                values = listOfData[0];
                break
            }
            case "min": {
                listOfData.sort(function(a, b){return a-b});
                values = listOfData[0];
                break
            }
            case "average": {
                var sum = 0;
                for(var i = 0; i < listOfData.length; i++) {
                    sum = sum + listOfData[i];
                }
                values = sum/listOfData.length;
                break
            }
            default: {
                console.log("Invalid choice");  
                break; 
            } 
        }
        return values;
    }
}
    