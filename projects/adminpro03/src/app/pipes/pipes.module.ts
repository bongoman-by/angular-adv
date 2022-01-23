import { NgModule } from '@angular/core';

import { ImagePipe } from '../pipes/image.pipe';

@NgModule({
  declarations: [ImagePipe],
  exports: [ImagePipe],
})
export class PipesModule {}
