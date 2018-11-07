import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChartData } from '../models/chartdata.model';

@Component({
  selector: 'app-chart-details',
  templateUrl: './chart-details.component.html',
  styleUrls: ['./chart-details.component.css']
})
export class ChartDetailsComponent implements OnInit {

  availableChartType: string[] = ['type1','type2','type3','type4'];
  availableAggregationRange: string[] = ['1 Hour','1 Day','1 Week','1 Month'];
  availableAggregationType: string[] = ['Average','Min','Max','Peak'];
  selectedSensors: string = 'Floor 1';


  ///////////////////

  type: string;
  id: string;

  realtime: boolean = false;

  data: Object;

  chartData: ChartData;

  constructor(private route: ActivatedRoute) { 

    var defaultData: any = {
      measurement: 'pressure', 
      range: 'Last Week', 
      aggregationRange: 'aggregation on the day',
      aggregationType: 'min', 
      usedSensors: ['Level 1']
    }

    this.route.params.subscribe(params => {
      this.id = params['id'];
      this.type = params['type'];
    });

    this.data = this.route.snapshot.data['data'];
    console.log(" ------------------> Received chart data : " , this.data);
    
    this.chartData = new ChartData(
        defaultData.aggregationType + " " + defaultData.measurement,
        defaultData.range,
        null,
        null, 
        defaultData.aggregationRange,
        defaultData.aggregationType,
        defaultData.usedSensors, 
        this.data 
      ) ;

    console.log(" ------------------> Generated Chart Data : " , this.chartData);
  }

  ngOnInit() {
  }

  toggleRealtime(event: any){

    this.realtime = ! this.realtime;

    console.log("Real time update enabled: " , this.realtime);
  }

  onChangeChartType(chartType: string){

    console.log("Chart type selected: " , chartType);

  }

  onChangeAggregationValue(aggregation: string) {

    console.log("Aggregation type selected: " , aggregation);

  }

  onChangeRangeValue(range: string) {

    console.log("Aggregation range selected: " , range);

  }

}
