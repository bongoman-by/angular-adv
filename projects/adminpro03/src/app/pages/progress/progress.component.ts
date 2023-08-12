import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { IProgressBar } from '../../components/component.interfaces';
import { ComponentsService } from './../../components/components.service';

@Component({
  selector: 'app-progress',
  templateUrl: './progress.component.html',
  styleUrls: ['./progress.component.scss'],
})
export class ProgressComponent implements OnInit, OnDestroy {
  subscription: Subscription = new Subscription();
  progressBarState: IProgressBar[];

  constructor(private componentsService: ComponentsService) {
    this.progressBarState = this.componentsService.progressBarState;
  }

  ngOnInit() {
    this.subscription = this.componentsService.increasingChanged.subscribe(
      (progressBar: IProgressBar) => {
        this.progressBarState[progressBar.id] = progressBar;
      }
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
