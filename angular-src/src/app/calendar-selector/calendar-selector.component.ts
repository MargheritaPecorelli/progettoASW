import { Component, Output, EventEmitter , Input } from '@angular/core';
import { NgxDateRangePickerOptions, NgxDateRangePickerDates } from 'ngx-daterangepicker';
import { Subject } from 'rxjs';

interface DateRange{
  start: Date,
  end: Date
}
@Component({
  selector: 'calendar-selector',
  templateUrl: './calendar-selector.component.html',
  styleUrls: ['./calendar-selector.component.css']
})


export class CalendarSelectorComponent {
  options: NgxDateRangePickerOptions;
  value: NgxDateRangePickerDates;
  @Output() dateChangeEventEmitter: EventEmitter<DateRange>;
  @Input() updateDate: Subject<string>;

  constructor() {
    this.dateChangeEventEmitter = new EventEmitter();
  }
  
  createStartDate(date:string){
    var dateFields = date.split("-");
    var dateToReturn = new Date()
    dateToReturn.setUTCFullYear(Number(dateFields[0]))
    dateToReturn.setUTCMonth(Number(dateFields[1])-1)
    dateToReturn.setUTCDate(Number(dateFields[2]))
    dateToReturn.setHours(1)
    dateToReturn.setMinutes(0)
    dateToReturn.setSeconds(0)
    var dateToday = new Date()
    if(dateToReturn.getTime() > dateToday.getTime()) {
      dateToReturn.setUTCFullYear(dateToday.getUTCFullYear())
      dateToReturn.setUTCMonth(dateToday.getUTCMonth())
      dateToReturn.setUTCDate(dateToday.getUTCDate())
    }
    return dateToReturn
  } 

  createEndDate(date:string){
    var dateFields = date.split("-");
    var dateToReturn = new Date()
    dateToReturn.setUTCFullYear(Number(dateFields[0]))
    dateToReturn.setUTCMonth(Number(dateFields[1])-1)
    dateToReturn.setUTCDate(Number(dateFields[2]))
    var dateToday = new Date()
    dateToReturn.setHours(dateToday.getUTCHours())
    dateToReturn.setMinutes(dateToday.getUTCMinutes())
    dateToReturn.setSeconds(0)
    if(dateToReturn.getTime() > dateToday.getTime()) {
      dateToReturn.setUTCFullYear(dateToday.getUTCFullYear())
      dateToReturn.setUTCMonth(dateToday.getUTCMonth())
      dateToReturn.setUTCDate(dateToday.getUTCDate())
    }
    return dateToReturn
  } 

  emitDateChangeEvent() {
    var dateRange: DateRange = {start: this.createStartDate(this.value.from.toString()), end: this.createEndDate(this.value.to.toString())};
    this.dateChangeEventEmitter.emit(dateRange);
  }

  ngOnInit() {
    this.options = {
      theme: 'gray',
      labels: ['Start', 'End'],
      menu: [
          {alias: 'td', text: 'Today', operation: '0d'},
          {alias: 'tm', text: 'This Month', operation: '0m'},
          {alias: 'lm', text: 'Last Month', operation: '-1m'},
          {alias: 'tw', text: 'This Week', operation: '0w'},
          {alias: 'lw', text: 'Last Week', operation: '-1w'},
          {alias: 'ty', text: 'This Year', operation: '0y'},
          {alias: 'ly', text: 'Last Year', operation: '-1y'},
          {alias: 'lyt', text: 'Last year from today', operation: '-1yt'},
      ],
      dateFormat: 'YYYY-MM-DD',
      outputFormat: 'YYYY-MM-DD',
      startOfWeek: 0,
      outputType: 'object',
      locale: 'en-UK',
      date: {
          from: new Date(),
          to: new Date()
      }
    };

  }
}