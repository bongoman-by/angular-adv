import { Component, Input } from '@angular/core';

import { IProgressBar } from '../component.interfaces';
import { ComponentsService } from './../components.service';

@Component({
  selector: 'app-increasing',
  templateUrl: './increasing.component.html',
  styles: [],
})
export class IncreasingComponent {
  @Input()
  progressBar!: IProgressBar;

  constructor(private componentsService: ComponentsService) {}

  changeProgress(value: number) {
    this.componentsService.setProgress(this.progressBar.id, value, 0);
  }

  changeInput(currentProgress: number) {
    this.componentsService.setProgress(this.progressBar.id, 0, currentProgress);
  }
}
