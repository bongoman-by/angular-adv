import { Component } from '@angular/core';

@Component({
  selector: 'app-chart-list',
  templateUrl: './chart-list.component.html',
  styleUrls: [],
})
export class ChartListComponent {
  doughnutChartLabels: string[] = [
    'Download Sales',
    'In-Store Sales',
    'Mail-Order Sales',
  ];

  data: number[] = [350, 450, 100];
  backgroundColor: string[] = ['#6857E6', '#009FEE', '#F02059'];
}
