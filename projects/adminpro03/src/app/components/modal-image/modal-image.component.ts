import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import Swal from 'sweetalert2';

import { FileUploadService } from '../../services/file-upload.service';
import { ModalImageService } from '../../services/modal-image.service';

@Component({
  selector: 'app-modal-image',
  templateUrl: './modal-image.component.html',
  styles: [],
})
export class ModalImageComponent implements OnInit {
  fileForm: FormGroup;
  imageData: string = '';
  image: File = new File(['new'], 'new.jpg', {
    type: 'image/jpg',
  });

  constructor(
    public modalImageService: ModalImageService,
    private fileUploadService: FileUploadService,
    private fb: FormBuilder
  ) {
    this.fileForm = this.fb.group({
      file: ['', Validators.required],
    });
  }

  ngOnInit(): void {}

  close() {
    this.modalImageService.finishModal();
    this.imageData = '';
  }

  onFileSelect(event: Event) {
    const target = event.target as HTMLInputElement;
    this.image = (target.files as FileList)[0];
    if (!this.image) {
      this.imageData = '';
    }
    const allowedMimeTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    if (this.image && allowedMimeTypes.includes(this.image.type)) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imageData = reader.result as string;
      };
      reader.readAsDataURL(this.image);
    }
  }

  onSubmitFile() {
    this.fileUploadService
      .changePhoto(
        this.image,
        this.modalImageService.type,
        this.modalImageService.uid
      )
      .then((res: any) => {
        res.json().then((body: any) => {
          if (body.ok) {
            this.modalImageService.img = body.image;
            Swal.fire({
              title: '',
              text: body.msg,
              icon: 'success',
            });
            this.close();
            this.modalImageService.loadedImage.emit(true);
          } else {
            Swal.fire({
              title: 'Error!',
              text: body.msg,
              icon: 'error',
            });
            this.close();
          }
        });
      });
  }
}
