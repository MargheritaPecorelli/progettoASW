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
        public period: number,
        public usedSensors: string[],
        public data: Object,
        public type: string = "line") {
            if(startDate == null && endDate == null) {
                switch(range) {
                    case "last week": {
                        this.endDate = new Date();
                        this.startDate = new Date(this.endDate);
                        this.endDate.setHours(this.endDate.getHours()-1);
                        this.startDate.setDate(this.startDate.getDate()-6);
                        this.startDate.setHours(this.startDate.getHours()-1);
                        break
                    }
                    case "last 30 days": {
                        this.endDate = new Date();
                        this.startDate = new Date(this.endDate);
                        this.endDate.setHours(this.endDate.getHours()-1);
                        this.startDate.setDate(this.startDate.getDate()-29);
                        this.startDate.setHours(this.startDate.getHours()-1);
                        break
                    }
                    default: {
                        console.log("Invalid choice of data range");
                        break; 
                    } 
                  }
            }
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

        var millisecondsInOneHour = 3600000;

        switch(this.aggregationRange) {
            case "every value": {
                allSensorsData.forEach(elem => {
                    var val = JSON.stringify(elem.value);
                    var time = new Date(elem.timestamp);
                    var valTime = JSON.stringify(time.getFullYear() + '-' + (time.getMonth()+1) + '-' + time.getDate() 
                    + ' ' + time.getHours() + 'h' + time.getMinutes() + 'm' + time.getSeconds() + 's');
                    var str = '{\"value\": \"' + val + '\", \"timestamp\": ' + valTime + '}';
                    dataList.push(JSON.parse(str));
                });
                break
            }
            case "aggregation on hours": {
                var dataToAggregate = [];
                var date = new Date(this.startDate);
                date.setHours(0);
                date.setMinutes(0);
                date.setSeconds(0);
                date.setMilliseconds(0);
                var hoursToRemove = 1;
                var diff: number;
                var hoursWithNoValues: number;
                
                allSensorsData.forEach(elem => {
                    var time = new Date(elem.timestamp);
                    if(time.getHours() == date.getHours()) {
                        dataToAggregate.push(elem.value);
                    } else {
                        if(dataToAggregate.length > 0) {
                            var val = JSON.stringify(this._aggregate(dataToAggregate));
                            var valTime = JSON.stringify(date.getFullYear() + '-' + (date.getMonth()+1) + '-' + date.getDate() 
                                + ' from ' + date.getHours() + 'h to ' + (date.getHours()+1) + 'h');
                            var str = '{\"value\": \"' + val + '\", \"timestamp\": ' + valTime + '}';
                            dataList.push(JSON.parse(str));
            
                            date.setHours(date.getHours()+1);
                            dataToAggregate = [];
            
                            diff = time.getTime()-date.getTime();
                            if(time.getTimezoneOffset() != date.getTimezoneOffset()){
                                hoursWithNoValues = (diff/millisecondsInOneHour)-1;
                            } else {
                                hoursWithNoValues = diff/millisecondsInOneHour;
                            }
                            
                            if(hoursWithNoValues >= 1) {
                                dataToAggregate = this._next(dataList, date, dataToAggregate, elem, hoursWithNoValues, true);
                            } else {
                                dataToAggregate.push(elem.value);
                            }
                        } else {
                            diff = time.getTime()-date.getTime();
                            if(time.getTimezoneOffset() != date.getTimezoneOffset()){
                                hoursWithNoValues = (diff/millisecondsInOneHour)-1;
                            } else {
                                hoursWithNoValues = diff/millisecondsInOneHour;
                            }
                            dataToAggregate = this._next(dataList, date, dataToAggregate, elem, hoursWithNoValues, true);
                        }
                    }
                });
                if(dataToAggregate.length > 0) {
                    // questo è uguale all'else e serve per aggregare i dati dell'ultima data
                    var val = JSON.stringify(this._aggregate(dataToAggregate));
                    var valTime = JSON.stringify(date.getFullYear() + '-' + (date.getMonth()+1) + '-' + date.getDate() 
                        + ' from ' + date.getHours() + 'h to ' + (date.getHours()+1) + 'h');
                    var str = '{\"value\": \"' + val + '\", \"timestamp\": ' + valTime + '}';
                    date.setHours(date.getHours()+1);
                    dataList.push(JSON.parse(str));
                    dataToAggregate = [];     
                }
                diff = this.endDate.getTime()-date.getTime();
                hoursWithNoValues = diff/millisecondsInOneHour;
                if(hoursWithNoValues >= 0) {
                    this._next(dataList, date, dataToAggregate, null, (hoursWithNoValues+1), true);
                }
                break
            }
            case "aggregation on days": {
                var dataToAggregate = [];
                var date = new Date(this.startDate);
                date.setHours(0);
                date.setMinutes(0);
                date.setSeconds(0);
                date.setMilliseconds(0);
                var hoursInADay = 24;
                var hoursToRemove = 24;
                var diff: number;
                var daysWithNoValues: number;
                
                allSensorsData.forEach(elem => {
                    var time = new Date(elem.timestamp);
                    if(time.getDate() == date.getDate()) {
                        dataToAggregate.push(elem.value);
                    } else {
                        if(dataToAggregate.length > 0) {
                            var val = JSON.stringify(this._aggregate(dataToAggregate));
                            var valTime = JSON.stringify(date.getFullYear() + '-' + (date.getMonth()+1) + '-' + date.getDate());
                            var str = '{\"value\": \"' + val + '\", \"timestamp\": ' + valTime + '}';
                            dataList.push(JSON.parse(str));
                            date.setDate(date.getDate()+1);
                            dataToAggregate = [];
                            
                            diff = time.getTime()-date.getTime();
                            daysWithNoValues = (diff/millisecondsInOneHour)/24;
                            
                            if(daysWithNoValues >= 1) {
                                dataToAggregate = this._next(dataList, date, dataToAggregate, elem, daysWithNoValues, false);
                            } else {
                                dataToAggregate.push(elem.value);
                            }
                        } else {
                            diff = time.getTime()-date.getTime();
                            daysWithNoValues = (diff/millisecondsInOneHour)/24;
                            dataToAggregate = this._next(dataList, date, dataToAggregate, elem, daysWithNoValues, false);
                        }
                    }   
                });
                if(dataToAggregate.length > 0) {
                    // questo è uguale all'else e serve per aggregare i dati dell'ultima data
                    var val = JSON.stringify(this._aggregate(dataToAggregate));
                    var valTime = JSON.stringify(date.getFullYear() + '-' + (date.getMonth()+1) + '-' + date.getDate());
                    var str = '{\"value\": \"' + val + '\", \"timestamp\": ' + valTime + '}';
                    date.setDate(date.getDate()+1);
                    dataList.push(JSON.parse(str));
                    dataToAggregate = [];     
                }
                diff = this.endDate.getTime()-date.getTime();
                daysWithNoValues = (diff/millisecondsInOneHour)/24;
                if(daysWithNoValues >= 0) {
                    this._next(dataList, date, dataToAggregate, null, (daysWithNoValues+1), false);
                }
                break
            }
            // case "aggregation on weeks": {
            //     var dataToAggregate = [];
            //     var startDayOfTheWeek = new Date(allSensorsData[0].timestamp);
            //     var endDayOfTheWeek = new Date(startDayOfTheWeek);
            //     endDayOfTheWeek.setDate(endDayOfTheWeek.getDate()+7);
            //     var hoursInAWeek = 168;
                
            //     allSensorsData.forEach(elem => {
            //         var time = new Date(elem.timestamp);

            //         var diff = time.getTime()-endDayOfTheWeek.getTime();
            //         var millisecondsInOneHour = 3600000;
            //         var hoursWithNoValues = diff/millisecondsInOneHour;

            //         if(diff < hoursInAWeek) {
            //             dataToAggregate.push(elem.value);
            //         } else {
            //             var val = JSON.stringify(this._aggregate(dataToAggregate));
            //             var valTime = JSON.stringify('from ' + startDayOfTheWeek.getFullYear() + '-' + (startDayOfTheWeek.getMonth()+1) + '-' 
            //                 + startDayOfTheWeek.getDate() + ' to ' + endDayOfTheWeek.getFullYear() + '-' + (endDayOfTheWeek.getMonth()+1) + '-' 
            //                 + endDayOfTheWeek.getDate());
            //             var str = '{\"value\": \"' + val + '\", \"timestamp\": ' + valTime + '}';
            //             dataList.push(JSON.parse(str));

            //             startDayOfTheWeek.setDate(startDayOfTheWeek.getDate()+7);
            //             endDayOfTheWeek.setDate(endDayOfTheWeek.getDate()+7);
            //             dataToAggregate = [];

            //             //calcolo le ore di differenza tra time e date in quanto 
            //             // time e date potrebbero avere la stessa ora (time.getHours() == date.getHours()) ma di giorni diversi
            //             var diff = time.getTime()-date.getTime();
            //             var millisecondsInOneHour = 3600000;
            //             var hoursWithNoValues = diff/millisecondsInOneHour;
                        
            //             //controllo che le ore di differenza tra time e date siano maggiori di 1
            //             if(hoursWithNoValues >= hoursInAWeek) {
            //                 this._next(dataList, date, dataToAggregate, elem, hoursWithNoValues, hoursInAWeek, false);
            //             }
            //         }       
            //     });
            //     // questo è uguale all'else e serve per aggregare i dati dell'ultima data
            //     var val = JSON.stringify(this._aggregate(dataToAggregate));
            //     var valTime = JSON.stringify('from ' + startDayOfTheWeek.getFullYear() + '-' + (startDayOfTheWeek.getMonth()+1) + '-' 
            //         + startDayOfTheWeek.getDate() + ' to ' + endDayOfTheWeek.getFullYear() + '-' + (endDayOfTheWeek.getMonth()+1) + '-' 
            //         + endDayOfTheWeek.getDate());
            //     var str = '{\"value\": \"' + val + '\", \"timestamp\": ' + valTime + '}';
            //     dataList.push(JSON.parse(str));
            //     break
            // }
            case "aggregation on months": {
                var dataToAggregate = [];
                var startDayOfTheMonth = new Date(this.startDate);
                startDayOfTheMonth.setHours(0);
                startDayOfTheMonth.setMinutes(0);
                startDayOfTheMonth.setSeconds(0);
                startDayOfTheMonth.setMilliseconds(0);
                var yearsOfDiff : number;
                var monthsOfDiff : number;
                var monthsWithNoValues: number;
                
                allSensorsData.forEach(elem => {
                    var time = new Date(elem.timestamp);
                    if(time.getMonth() == startDayOfTheMonth.getMonth()) {
                        dataToAggregate.push(elem.value);
                    } else {
                        if(dataToAggregate.length > 0) {
                            var val = JSON.stringify(this._aggregate(dataToAggregate));
                            var valTime = JSON.stringify(startDayOfTheMonth.getFullYear() + '-' + (startDayOfTheMonth.getMonth()+1));
                            var str = '{\"value\": \"' + val + '\", \"timestamp\": ' + valTime + '}';
                            dataList.push(JSON.parse(str));
            
                            startDayOfTheMonth.setMonth(startDayOfTheMonth.getMonth()+1);
                            dataToAggregate = [];
                            
                            yearsOfDiff = time.getFullYear()-startDayOfTheMonth.getFullYear();
                            monthsOfDiff = time.getMonth()-startDayOfTheMonth.getMonth();
                            monthsWithNoValues = ((yearsOfDiff*12)+monthsOfDiff);
                            
                            if(monthsWithNoValues >= 1) {
                                dataToAggregate = this._nextMonth(monthsWithNoValues, dataList, startDayOfTheMonth, dataToAggregate, elem);
                            } else {
                                dataToAggregate.push(elem.value);
                            }
                        } else {
                            yearsOfDiff = time.getFullYear()-startDayOfTheMonth.getFullYear();
                            monthsOfDiff = time.getMonth()-startDayOfTheMonth.getMonth();
                            monthsWithNoValues = ((yearsOfDiff*12)+monthsOfDiff);
                            dataToAggregate = this._nextMonth(monthsWithNoValues, dataList, startDayOfTheMonth, dataToAggregate, elem);
                        }
                    }
                });
                if(dataToAggregate.length > 0) {
                    // questo è uguale all'else e serve per aggregare i dati dell'ultima data
                    var val = JSON.stringify(this._aggregate(dataToAggregate));
                    var valTime = JSON.stringify(startDayOfTheMonth.getFullYear() + '-' + (startDayOfTheMonth.getMonth()+1));
                    var str = '{\"value\": \"' + val + '\", \"timestamp\": ' + valTime + '}';
                    startDayOfTheMonth.setMonth(startDayOfTheMonth.getMonth()+1);
                    dataList.push(JSON.parse(str));
                    dataToAggregate = [];     
                }
                yearsOfDiff = this.endDate.getFullYear()-startDayOfTheMonth.getFullYear();
                monthsOfDiff = this.endDate.getMonth()-startDayOfTheMonth.getMonth();
                monthsWithNoValues = ((yearsOfDiff*12)+monthsOfDiff);
                if(monthsWithNoValues >= 0) {
                    this._nextMonth((monthsWithNoValues+1), dataList, startDayOfTheMonth, dataToAggregate, null);
                }
                break
            }
            // case "aggregation on quarters": {
            //     var dataToAggregate = [];
            //     var startDate = new Date(allSensorsData[0].timestamp);
            //     startDate.setDate(1);
            //     startDate.setHours(0);
            //     startDate.setMinutes(0);
            //     startDate.setSeconds(0);
            //     startDate.setMilliseconds(0);
            //     var endMonth = new Date(startDate);
            //     endMonth.setMonth(endMonth.getMonth()+3);

            //     allSensorsData.forEach(elem => {
            //         var time = new Date(elem.timestamp);
                    
            //         // es possibili: 
            //         //      se startDate.getMonth() inferiore a 10 (es 8) => basta che time.getMonth() sia <= a endMonth=startDate.getMonth()+2 (es 10 -> 8, 9, 10) 
            //         //          e che, se time.getMonth() è == a endMonth, time.getDate() sia <= a startDate.getDate()
            //         //      se startDate.getMonth() è 10 o 11 => endMonth deve essere 0 o 1
            //         if(((time.getMonth() == endMonth) && (time.getDate() <= startDate.getDate())) || 
            //                     (time.getMonth() < endMonth) || 
            //                     ((time.getMonth() >= 10) && ((endMonth == 0) || (endMonth == 1)))) {
            //             dataToAggregate.push(elem.value);
            //         } else {                        
            //             var val = JSON.stringify(this._aggregate(dataToAggregate));
            //             var toDate: string;
            //             if(endMonth == 0 || endMonth == 1) {
            //                 toDate = 'to ' + (startDate.getFullYear()+1) + '-' + (endMonth+1) + '-' + startDate.getDate();
            //             } else {
            //                 toDate = 'to ' + startDate.getFullYear() + '-' + (endMonth+1) + '-' + startDate.getDate();
            //             }
            //             var valTime = JSON.stringify('from ' + startDate.getFullYear() + '-' + (startDate.getMonth()+1) + '-' + startDate.getDate() + toDate);
            //             var str = '{\"value\": \"' + val + '\", \"timestamp\": ' + valTime + '}';
            //             dataList.push(JSON.parse(str));

            //             if(endMonth == 11) {
            //                 startDate.setMonth(0);
            //             } else {
            //                 startDate.setMonth(endMonth+1);
            //             }
            //             dataToAggregate = [];
            //             dataToAggregate.push(elem.value);
            //         }
            //     });
            //     // questo è uguale all'else e serve per aggregare i dati dell'ultima data
            //     var val = JSON.stringify(this._aggregate(dataToAggregate));
            //     var toDate: string;
            //     if(endMonth == 0 || endMonth == 1) {
            //         toDate = 'to ' + (startDate.getFullYear()+1) + '-' + (endMonth+1) + '-' + startDate.getDate();
            //     } else {
            //         toDate = 'to ' + startDate.getFullYear() + '-' + (endMonth+1) + '-' + startDate.getDate();
            //     }
            //     var valTime = JSON.stringify('from ' + startDate.getFullYear() + '-' + (startDate.getMonth()+1) + '-' + startDate.getDate() + toDate);
            //     var str = '{\"value\": \"' + val + '\", \"timestamp\": ' + valTime + '}';
            //     dataList.push(JSON.parse(str));
            //     break
            // }
            case "aggregation every X days": {
                var dataToAggregate = [];
                var startDatePeriod = new Date(this.startDate);
                startDatePeriod.setHours(0);
                startDatePeriod.setMinutes(0);
                startDatePeriod.setSeconds(0);
                startDatePeriod.setMilliseconds(0);
                var endDatePeriod = new Date(startDatePeriod);
                endDatePeriod.setDate(endDatePeriod.getDate()+this.period);
                
                allSensorsData.forEach(elem => {
                    var time = new Date(elem.timestamp);
                    var diff = endDatePeriod.getTime()-time.getTime();
                    if(diff >= 0){
                        dataToAggregate.push(elem.value);
                    } else {
                        if(dataToAggregate.length > 0) {
                            var val = JSON.stringify(this._aggregate(dataToAggregate));
                            var end: Date;
                            end = new Date(endDatePeriod);
                            end.setDate(end.getDate()-1);
                            var valTime = JSON.stringify('from ' + startDatePeriod.getFullYear() + '-' + (startDatePeriod.getMonth()+1) + '-' 
                                + startDatePeriod.getDate() + ' to ' + end.getFullYear() + '-' + (end.getMonth()+1) + '-' 
                                + end.getDate());
                            var str = '{\"value\": \"' + val + '\", \"timestamp\": ' + valTime + '}';
                            dataList.push(JSON.parse(str));
            
                            startDatePeriod.setDate(startDatePeriod.getDate()+this.period);
                            endDatePeriod.setDate(endDatePeriod.getDate()+this.period);
                            dataToAggregate = [];                            

                            diff = time.getTime()-endDatePeriod.getTime();
                            if(diff == 0) {
                                var periodsWithNoValues = diff;
                            } else {
                                // (this.period*24) = numero di ore dentro a que lasso di tempo (period)
                                var periodsWithNoValues = (diff/millisecondsInOneHour)/(this.period*24);
                            }

                            if(periodsWithNoValues >= 1) {
                                dataToAggregate = this._nextPeriod(dataList, periodsWithNoValues, startDatePeriod, endDatePeriod, dataToAggregate, elem);
                            } else {
                                dataToAggregate.push(elem.value);
                            }
                        } else {
                            diff = time.getTime()-endDatePeriod.getTime();
                            // (this.period*24) = numero di ore dentro a que lasso di tempo (period)
                            var periodsWithNoValues = (diff/millisecondsInOneHour)/(this.period*24);
                            dataToAggregate = this._nextPeriod(dataList, periodsWithNoValues, startDatePeriod, endDatePeriod, dataToAggregate, elem);
                        }
                    }       
                });
                if(dataToAggregate.length > 0) {
                    /// questo è uguale all'else e serve per aggregare i dati dell'ultima data
                    var val = JSON.stringify(this._aggregate(dataToAggregate));
                    var valTime: string;

                    diff = this.endDate.getTime()-endDatePeriod.getTime();
                    var end: Date;
                    if(diff < 0) {
                        valTime = JSON.stringify('from ' + startDatePeriod.getFullYear() + '-' + (startDatePeriod.getMonth()+1) + '-' 
                        + startDatePeriod.getDate() + ' to ' + this.endDate.getFullYear() + '-' + (this.endDate.getMonth()+1) + '-' 
                        + this.endDate.getDate());
                    } else {
                        end = new Date(endDatePeriod);
                        end.setDate(end.getDate()-1);
                        valTime = JSON.stringify('from ' + startDatePeriod.getFullYear() + '-' + (startDatePeriod.getMonth()+1) + '-' 
                            + startDatePeriod.getDate() + ' to ' + end.getFullYear() + '-' + (end.getMonth()+1) + '-' 
                            + end.getDate());
                    }
                    var str = '{\"value\": \"' + val + '\", \"timestamp\": ' + valTime + '}';
                    startDatePeriod.setDate(startDatePeriod.getDate()+this.period);
                    endDatePeriod.setDate(endDatePeriod.getDate()+this.period);
                    dataList.push(JSON.parse(str));
                    dataToAggregate = [];     
                }
                diff = this.endDate.getTime()-endDatePeriod.getTime();
                if(diff == 0) {
                    var periodsWithNoValues = diff;
                } else {
                    var periodsWithNoValues = (diff/millisecondsInOneHour)/(this.period*24);
                }
                if(periodsWithNoValues >= 0) {
                    dataToAggregate = this._nextPeriod(dataList, (periodsWithNoValues+1), startDatePeriod, endDatePeriod, dataToAggregate, null);
                } else {
                    dataToAggregate = this._nextPeriod(dataList, (periodsWithNoValues+1), startDatePeriod, this.endDate, dataToAggregate, null);
                }
                break
            }
            case "aggregation of every value": {
                var dataToAggregate = [];
                var start = new Date(allSensorsData[0].timestamp);
                var end = new Date(allSensorsData[(allSensorsData.length-1)].timestamp);
                allSensorsData.forEach(elem => {
                    dataToAggregate.push(elem.value);
                });
                var val = JSON.stringify(this._aggregate(dataToAggregate));        
                var valTime = JSON.stringify('from ' + start.getFullYear() + '-' + (start.getMonth()+1) + '-' + start.getDate() + ' ' 
                    + start.getHours() + 'h' + start.getMinutes() + 'm' + start.getSeconds() + ' to ' + end.getFullYear() + '-' 
                    + (end.getMonth()+1) + '-' + end.getDate() + ' ' + end.getHours() + 'h' + end.getMinutes() + 'm' + end.getSeconds());
                var str = '{\"value\": \"' + val + '\", \"timestamp\": ' + valTime + '}';
                dataList.push(JSON.parse(str));
                break
            }
            case "aggregation on day and night": {
                var dataToAggregateOfDay = [];
                var dataToAggregateOfNight = [];
                var date = new Date(this.startDate);
                date.setHours(0);
                date.setMinutes(0);
                date.setSeconds(0);
                date.setMilliseconds(0);
                var dayList = [];
                var nightList = [];
                var diff: number;
                var daysWithNoValues: number;
                
                allSensorsData.forEach(elem => {
                    var time = new Date(elem.timestamp);
                    if(time.getDate() == date.getDate()) {
                        if((time.getHours() >= 8) && ((time.getHours() < 20))) {
                            dataToAggregateOfDay.push(elem.value);    
                        } else {
                            dataToAggregateOfNight.push(elem.value);
                        }
                    } else {
                        if(dataToAggregateOfDay.length > 0 || dataToAggregateOfNight.length > 0) {
                            if(dataToAggregateOfDay.length > 0) {
                                var valDay = JSON.stringify(this._aggregate(dataToAggregateOfDay));
                                var valTimeDay = JSON.stringify(date.getFullYear() + '-' + (date.getMonth()+1) + '-' + date.getDate() + ' from 8h to 20h');
                                var strDay = '{\"value\": \"' + valDay + '\", \"timestamp\": ' + valTimeDay + '}';
                                dayList.push(JSON.parse(strDay));
                            }
        
                            if(dataToAggregateOfNight.length > 0) {
                                var valNight = JSON.stringify(this._aggregate(dataToAggregateOfNight));
                                var valTimeNight = JSON.stringify(date.getFullYear() + '-' + (date.getMonth()+1) + '-' + date.getDate() + ' from 20h to 8h');
                                var strNight = '{\"value\": \"' + valNight + '\", \"timestamp\": ' + valTimeNight + '}';
                                nightList.push(JSON.parse(strNight));
                            }
            
                            date.setDate(date.getDate()+1);
                            dataToAggregateOfDay = [];
                            dataToAggregateOfNight = [];
            
                            diff = time.getTime()-date.getTime();
                            daysWithNoValues = (diff/millisecondsInOneHour)/24;
                            
                            //controllo che le ore di differenza tra time e date siano maggiori di 1
                            if(daysWithNoValues >= 1) {
                                dataToAggregate = this._nextDayAndNight(date, dataToAggregateOfDay, dataToAggregateOfNight, dayList, nightList, elem, time, daysWithNoValues);
                            } else {
                                if((time.getHours() >= 8) && ((time.getHours() < 20))) {
                                    dataToAggregateOfDay.push(elem.value);    
                                } else {
                                    dataToAggregateOfNight.push(elem.value);
                                }
                            }
                        } else {
                            diff = time.getTime()-date.getTime();
                            daysWithNoValues = (diff/millisecondsInOneHour)/24;
                            dataToAggregate = this._nextDayAndNight(date, dataToAggregateOfDay, dataToAggregateOfNight, dayList, nightList, elem, time, daysWithNoValues);
                        }
                    }   
                });
                if(dataToAggregateOfDay.length > 0) {
                    // questo è uguale all'else e serve per aggregare i dati dell'ultima data
                    var valDay = JSON.stringify(this._aggregate(dataToAggregateOfDay));
                    var valTimeDay = JSON.stringify(date.getFullYear() + '-' + (date.getMonth()+1) + '-' + date.getDate() + ' from 8h to 20h');
                    var strDay = '{\"value\": \"' + valDay + '\", \"timestamp\": ' + valTimeDay + '}';
                    dayList.push(JSON.parse(strDay));
                    dataToAggregateOfDay = [];
                    if(dataToAggregateOfNight.length > 0) {
                        // questo è uguale all'else e serve per aggregare i dati dell'ultima data
                        var valNight = JSON.stringify(this._aggregate(dataToAggregateOfNight));
                        var valTimeNight = JSON.stringify(date.getFullYear() + '-' + (date.getMonth()+1) + '-' + date.getDate() + ' from 20h to 8h');
                        var strNight = '{\"value\": \"' + valNight + '\", \"timestamp\": ' + valTimeNight + '}';
                        nightList.push(JSON.parse(strNight));
                        date.setDate(date.getDate()+1);
                        dataToAggregateOfNight = [];
                    }
                }
                diff = this.endDate.getTime()-date.getTime();
                daysWithNoValues = (diff/millisecondsInOneHour)/24;
                if(daysWithNoValues >= 0) {
                    dataToAggregate = this._nextDayAndNight(date, dataToAggregateOfDay, dataToAggregateOfNight, dayList, nightList, null, null, (daysWithNoValues+1));
                }
                dataList.push(dayList);
                dataList.push(nightList);
                break
            }
            default: {
                console.log("Invalid choice");  
                break; 
            } 
        }
        //console.log(dataList);
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
                if(sum == 0) {
                    values = sum;
                } else {
                    values = sum/listOfData.length;
                }
                break
            }
            case "moda": {
                var modeMap = {};
                values = listOfData[0];
                var maxCount = 1;
                for(var i = 0; i < listOfData.length; i++) {
                    var el = listOfData[i];
                    if(modeMap[el] == null) {
                        modeMap[el] = 1;
                    } else {
                        modeMap[el]++;
                    }
                    if(modeMap[el] > maxCount) {
                        values = el;
                        maxCount = modeMap[el];
                    }
                }
                break
            }
            default: {
                console.log("Invalid choice");  
                break; 
            } 
        }
        return values;
    }

    _next(dataList, date, dataToAggregate, elem, timeWithNoValues, hours) {
        for(var i = 1; i <= timeWithNoValues; i++) {
            dataToAggregate.push(0);
            
            var val = JSON.stringify(this._aggregate(dataToAggregate));
            var valTime;
            if(hours) {
                valTime = JSON.stringify(date.getFullYear() + '-' + (date.getMonth()+1) + '-' + date.getDate() 
                + ' from ' + date.getHours() + 'h to ' + (date.getHours()+1) + 'h');
            } else {
                valTime = JSON.stringify(date.getFullYear() + '-' + (date.getMonth()+1) + '-' + date.getDate());
            }
            var str = '{\"value\": \"' + val + '\", \"timestamp\": ' + valTime + '}';
            dataList.push(JSON.parse(str));
    
            if(hours) {
                date.setHours(date.getHours()+1);
            } else {
                date.setDate(date.getDate()+1);
            }
            dataToAggregate = [];
        }
        if(elem != null) {
            dataToAggregate.push(elem.value);
        }
        return dataToAggregate;
    }
    
    _nextMonth(monthsWithNoValues, dataList, startDayOfTheMonth, dataToAggregate, elem) {
        for(var i = 1; i <= monthsWithNoValues; i++) {
            dataToAggregate.push(0);
            
            var val = JSON.stringify(this._aggregate(dataToAggregate));
            var valTime = JSON.stringify(startDayOfTheMonth.getFullYear() + '-' + (startDayOfTheMonth.getMonth()+1));
            var str = '{\"value\": \"' + val + '\", \"timestamp\": ' + valTime + '}';
            dataList.push(JSON.parse(str));

            startDayOfTheMonth.setMonth(startDayOfTheMonth.getMonth()+1);
            dataToAggregate = [];

            //controllo che le ore di differenza tra time e date siano maggiori di 1
            // if((time.getMonth() != startDayOfTheMonth.getMonth()) || (time.getFullYear() != startDayOfTheMonth.getFullYear())) {
            //     this._nextMonth(monthsWithNoValues, time, dataList, startDayOfTheMonth, dataToAggregate, elem);
            // }   
        }
        // if(elem == null) {
        //     dataToAggregate.push(0);
        //     var val = JSON.stringify(this._aggregate(dataToAggregate));
        //     var valTime = JSON.stringify(startDayOfTheMonth.getFullYear() + '-' + (startDayOfTheMonth.getMonth()+1));
        //     var str = '{\"value\": \"' + val + '\", \"timestamp\": ' + valTime + '}';
        //     dataList.push(JSON.parse(str));
        // } else {
        //     dataToAggregate.push(elem.value);
        // }
        if(elem != null) {
            dataToAggregate.push(elem.value);
        }
        return dataToAggregate;
    }
    
    //, elem, hoursWithNoValues, hoursToAddAndOrRemove, limit, hours
    _nextPeriod(dataList, periodsWithNoValues, startDatePeriod, endDatePeriod, dataToAggregate, elem) {
        for(var i = 0; i <= periodsWithNoValues; i++) {
            dataToAggregate.push(0);
            
            var val = JSON.stringify(this._aggregate(dataToAggregate));
            var valTime: string
            var end : Date;
            
            var diff = this.endDate.getTime()-endDatePeriod.getTime();
            if(diff < 0) {
                valTime = JSON.stringify('from ' + startDatePeriod.getFullYear() + '-' + (startDatePeriod.getMonth()+1) + '-' 
                + startDatePeriod.getDate() + ' to ' + this.endDate.getFullYear() + '-' + (this.endDate.getMonth()+1) + '-' 
                + this.endDate.getDate());
            } else {
                end = new Date(endDatePeriod);
                end.setDate(end.getDate()-1);
                valTime = JSON.stringify('from ' + startDatePeriod.getFullYear() + '-' + (startDatePeriod.getMonth()+1) + '-' 
                + startDatePeriod.getDate() + ' to ' + end.getFullYear() + '-' + (end.getMonth()+1) + '-' 
                + end.getDate());
            }
        
            var str = '{\"value\": \"' + val + '\", \"timestamp\": ' + valTime + '}';
            dataList.push(JSON.parse(str));

            startDatePeriod.setDate(startDatePeriod.getDate()+this.period);
            endDatePeriod.setDate(endDatePeriod.getDate()+this.period);
            
            dataToAggregate = [];

            // var diff = endDatePeriod.getTime()-time.getTime();
            // var hoursLeft = diff/millisecondsInOneHour;
            
            // //controllo che le ore di differenza tra time e date siano maggiori di 1
            // if(hoursLeft < 0) {
            //     this._nextPeriod(dataList, periodsWithNoValues, startDatePeriod, endDatePeriod, dataToAggregate, time, elem, millisecondsInOneHour);
            // } else if(elem == null) {
            //     dataToAggregate.push(0);
            //     var val = JSON.stringify(this._aggregate(dataToAggregate));
            //     var valTime = JSON.stringify('from ' + startDatePeriod.getFullYear() + '-' + (startDatePeriod.getMonth()+1) + '-' 
            //         + startDatePeriod.getDate() + ' to ' + time.getFullYear() + '-' + (time.getMonth()+1) + '-' 
            //         + time.getDate());
            //     var str = '{\"value\": \"' + val + '\", \"timestamp\": ' + valTime + '}';
            //     dataList.push(JSON.parse(str));
            // }
        }
        if(elem != null){
            dataToAggregate.push(elem.value);
        }
        return dataToAggregate;
    }
    
    _nextDayAndNight(date, dataToAggregateOfDay, dataToAggregateOfNight, dayList, nightList, elem, time, daysWithNoValues) {
        var list = [];
        for(var i = 1; i <= daysWithNoValues; i++) {    
            dataToAggregateOfDay.push(0);
            dataToAggregateOfNight.push(0);
            
            var valDay = JSON.stringify(this._aggregate(dataToAggregateOfDay));
            var valTimeDay = JSON.stringify(date.getFullYear() + '-' + (date.getMonth()+1) + '-' + date.getDate() + ' from 8h to 20h');
            var strDay = '{\"value\": \"' + valDay + '\", \"timestamp\": ' + valTimeDay + '}';
            dayList.push(JSON.parse(strDay));

            var valNight = JSON.stringify(this._aggregate(dataToAggregateOfNight));
            var valTimeNight = JSON.stringify(date.getFullYear() + '-' + (date.getMonth()+1) + '-' + date.getDate() + ' from 20h to 8h');
            var strNight = '{\"value\": \"' + valNight + '\", \"timestamp\": ' + valTimeNight + '}';
            nightList.push(JSON.parse(strNight));

            date.setDate(date.getDate()+1);
            
            dataToAggregateOfDay = [];
            dataToAggregateOfNight = [];
        }
        if(elem != null) {
            if((time.getHours() >= 8) && ((time.getHours() < 20))) {
                dataToAggregateOfDay.push(elem.value);    
            } else {
                dataToAggregateOfNight.push(elem.value);
            }
        }
        list.push(dayList);
        list.push(nightList);
        return list;
    }
}
    