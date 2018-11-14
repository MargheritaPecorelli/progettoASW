import { Component, Output, EventEmitter } from '@angular/core';
import { NgxDateRangePickerOptions, NgxDateRangePickerDates } from 'ngx-daterangepicker';

@Component({
  selector: 'calendar-selector',
  templateUrl: './calendar-selector.component.html',
  styleUrls: ['./calendar-selector.component.css']
})


export class CalendarSelectorComponent {
  options: NgxDateRangePickerOptions;
  value: NgxDateRangePickerDates;
  @Output() dateChangeEventEmitter: EventEmitter<String>;

  constructor() {
    this.dateChangeEventEmitter = new EventEmitter();
  }

  emitDateChangeEvent() {
    var dateRange = this.value.from.toString() + "T00:00:00Z;" + this.value.to.toString() + "T23:59:00Z";
    // console.log(dateRange);
    this.dateChangeEventEmitter.emit(dateRange);
  }

  ngOnInit() {
    this.options = {
            theme: 'green',
            labels: ['Start', 'End'],
            menu: [
                {alias: 'td', text: 'Today', operation: '0d'},
                {alias: 'tm', text: 'This Month', operation: '0m'},
                {alias: 'lm', text: 'Last Month', operation: '-1m'},
                {alias: 'tw', text: 'This Week', operation: '0w'},
                {alias: 'lw', text: 'Last Week', operation: '-1w'},
                {alias: 'ty', text: 'This Year', operation: '0y'},
                {alias: 'ly', text: 'Last Year', operation: '-1y'},
                {alias: 'ny', text: 'Next Year', operation: '+1y'},
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