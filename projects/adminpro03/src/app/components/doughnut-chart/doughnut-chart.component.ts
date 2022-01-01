import { Component, Input, OnInit } from '@angular/core';

import { ChartData, ChartType } from 'chart.js';

@Component({
  selector: 'app-doughnut-chart',
  templateUrl: './doughnut-chart.component.html',
  styleUrls: [],
})
export class DoughnutChartComponent implements OnInit {
  @Input() title: string = 'no title';
  @Input() doughnutChartLabels: string[] = [];
  @Input() data: number[] = [];
  @Input() backgroundColor: string[] = [];
  doughnutChartData!: ChartData<'doughnut'>;
  doughnutChartType: ChartType = 'doughnut';

  ngOnInit(): void {
    this.doughnutChartData = {
      labels: this.doughnutChartLabels,
      datasets: [{ data: this.data, backgroundColor: this.backgroundColor }],
    };
  }

  // events
  chartClicked({ event, active }: { event: MouseEvent; active: {}[] }): void {
    console.log(event, active);
  }

  public chartHovered({
    event,
    active,
  }: {
    event: MouseEvent;
    active: {}[];
  }): void {
    console.log(event, active);
  }
}
