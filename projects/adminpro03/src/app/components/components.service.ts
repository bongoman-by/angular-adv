import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { IProgressBar } from './component.interfaces';

@Injectable({
  providedIn: 'root',
})
export class ComponentsService {
  increasingChanged = new Subject<IProgressBar>();
  progressBarState: IProgressBar[] = [
    {
      id: 0,
      progress: 40,
      progressByString: '40%',
      classBg: { 'bg-primary': true },
      classBtn: { 'btn-primary': true },
    },
    {
      id: 1,
      progress: 60,
      progressByString: '60%',
      classBg: { 'bg-info': true },
      classBtn: { 'btn-info': true },
    },
  ];

  setProgress(id: number, value: number, currentProgress: number) {
    let progress: number =
      currentProgress > 0
        ? currentProgress
        : this.progressBarState[id].progress + value;
    if (progress > 100) {
      progress = 100;
    } else if (progress < 0) {
      progress = 0;
    }
    this.progressBarState[id].progress = progress;
    this.progressBarState[
      id
    ].progressByString = `${this.progressBarState[id].progress}%`;
    this.increasingChanged.next(this.progressBarState[id]);
  }
}
