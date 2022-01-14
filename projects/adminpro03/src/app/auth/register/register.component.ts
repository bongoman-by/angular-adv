import { Component } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormControl,
} from '@angular/forms';
import { Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      name: ['bongoman', Validators.required],
      email: ['bongoman@mail.ru', [Validators.email, Validators.required]],
      password: ['7691989', [Validators.required, Validators.minLength(6)]],
      confirmPassword: [
        '7691989',
        [Validators.required, Validators.minLength(6), this.checkPassword],
      ],
      terms: [true, this.checkTerms],
    });
  }

  getControl(property: string) {
    return this.registerForm.get(property);
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

  checkPassword(input: FormControl) {
    let notEquals = false;
    if (!input.parent || !input.parent.get('password')) {
      return null;
    } else {
      notEquals = input.parent.get('password')?.value === input.value;
    }

    return notEquals ? null : { notEquals: true };
  }

  checkTerms(input: FormControl) {
    const confirmTerms = input.value === true;
    return confirmTerms ? null : { notConfirmTerms: true };
  }

  onSubmit() {
    this.userService.createUser(this.registerForm.value).subscribe({
      next: () => this.router.navigateByUrl('/'),
      error: (e) => {
        Swal.fire({
          title: 'Error!',
          text: e.error,
          icon: 'error',
        });
      },
    });
  }
}
