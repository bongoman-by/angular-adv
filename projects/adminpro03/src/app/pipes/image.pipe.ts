import { Pipe, PipeTransform } from '@angular/core';

import { environment } from '../../environments/environment';
import { Collections } from './../shared/collections.enum';

@Pipe({
  name: 'image',
})
export class ImagePipe implements PipeTransform {
  transform(img: string, collection: Collections = Collections.users): string {
    if (img.includes('https')) {
      return img;
    } else {
      if (img) {
        return `${environment.base_url}/upload/${collection}/${img}`;
      } else {
        return `${environment.base_url}/upload/${collection}/image-not-found.png`;
      }
    }
  }
}
