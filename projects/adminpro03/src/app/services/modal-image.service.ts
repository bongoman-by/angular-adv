import { EventEmitter, Injectable } from '@angular/core';

import { environment } from '../../environments/environment';

import { Collections } from './../shared/collections.enum';

@Injectable({
  providedIn: 'root',
})
export class ModalImageService {
  public img: string = '';
  public uid: string = '';
  public type: Collections = Collections.users;
  private _showModal: boolean = false;

  public loadedImage: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor() {}

  get isModal() {
    return this._showModal;
  }

  finishModal() {
    this._showModal = false;
    const img = this.img;
    this.setImageUrl(img);
  }

  startModal(img: string, uid: string, type: Collections) {
    this._showModal = true;
    this.uid = uid;
    this.type = type;
    this.setImageUrl(img);
  }

  setImageUrl(img: string) {
    if (img.includes('https')) {
      this.img = img;
    } else {
      if (img) {
        this.img = `${environment.base_url}/upload/${this.type}/${img}`;
      } else {
        this.img = `${environment.base_url}/upload/${this.type}/image-not-found.png`;
      }
    }
  }
}
