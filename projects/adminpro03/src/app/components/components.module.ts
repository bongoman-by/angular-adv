import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { NgChartsModule } from 'ng2-charts';

import { IncreasingComponent } from './increasing/increasing.component';
import { DoughnutChartComponent } from './doughnut-chart/doughnut-chart.component';

@NgModule({
  declarations: [IncreasingComponent, DoughnutChartComponent],
  imports: [CommonModule, FormsModule, NgChartsModule],
  exports: [IncreasingComponent, DoughnutChartComponent],
})
export class ComponentsModule {}
