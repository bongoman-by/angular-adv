import { Component } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormControl,
} from '@angular/forms';
import { Validators } from '@angular/forms';

import Swal from 'sweetalert2';

import { UserService } from '../../services/user.service';
import { FileUploadService } from '../../services/file-upload.service';

import { User } from '../../models/user.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styles: [],
})
export class ProfileComponent {
  settingsForm: FormGroup;
  fileForm: FormGroup;
  public user: User;
  imageData: string = '';
  image: File = new File(['new'], 'new.jpg', {
    type: 'image/jpg',
  });

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private fileUploadService: FileUploadService
  ) {
    this.user = this.userService.user;
    this.settingsForm = this.fb.group({
      name: [this.user.name, Validators.required],
      email: [this.user.email, [Validators.email, Validators.required]],
      oldPassword: ['', [Validators.required, Validators.minLength(6)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: [
        '',
        [Validators.required, Validators.minLength(6), this.checkPassword],
      ],
      signup: [false],
    });
    this.fileForm = this.fb.group({
      file: ['', Validators.required],
    });
  }

  getControl(property: string) {
    return this.settingsForm.get(property);
  }

  checkControl(property: string) {
    const control = this.getControl(property);
    if (control === null || control === undefined) {
      return false;
    } else {
      return control.invalid && (control.dirty || control.touched);
    }
  }

  checkError(control: AbstractControl | null | undefined, property: string) {
    if (control === null || control === undefined) {
      return false;
    } else {
      if (control.errors !== null && control.errors !== undefined) {
        const prop = control.errors[property];
        if (property === 'minlength' && prop !== undefined) {
          return prop.requiredLength > prop.actualLength;
        }
        return prop;
      } else {
        return false;
      }
    }
  }

  checkSettingForm() {
    if (this.getControl('oldPassword')?.value.length === 0) {
      if (this.checkControl('name') || this.checkControl('email')) {
        return this.settingsForm.invalid;
      } else {
        return false;
      }
    } else {
      return this.settingsForm.invalid;
    }
  }

  checkPassword(input: FormControl) {
    let notEquals = false;
    if (!input.parent || !input.parent.get('password')) {
      return null;
    } else {
      notEquals = input.parent.get('password')?.value === input.value;
    }

    return notEquals ? null : { notEquals: true };
  }

  onSubmitSettings() {
    this.userService.updateItem(this.settingsForm.value).subscribe({
      next: (res) => {
        this.user.name = res.user.name;
        this.user.email = res.user.email;
        Swal.fire({
          title: '',
          text: res.msg,
          icon: 'success',
        });
      },
    });
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
      .changePhoto(this.image, 'users', this.user.uid || '')
      .then((res: any) => {
        res.json().then((body: any) => {
          if (body.ok) {
            this.user.image = body.image;
            Swal.fire({
              title: '',
              text: body.msg,
              icon: 'success',
            });
          } else {
            Swal.fire({
              title: 'Error!',
              text: body.msg,
              icon: 'error',
            });
          }
        });
      });
  }
}
