import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgChartsModule } from 'ng2-charts';

import { IncreasingComponent } from './increasing/increasing.component';
import { DoughnutChartComponent } from './doughnut-chart/doughnut-chart.component';
import { ModalImageComponent } from './modal-image/modal-image.component';

@NgModule({
  declarations: [
    IncreasingComponent,
    DoughnutChartComponent,
    ModalImageComponent,
  ],
  imports: [CommonModule, FormsModule, NgChartsModule, ReactiveFormsModule],
  exports: [IncreasingComponent, DoughnutChartComponent, ModalImageComponent],
})
export class ComponentsModule {}
