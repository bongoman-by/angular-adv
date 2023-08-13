import { Component, OnInit, NgZone } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

declare const window: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  registerForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private _ngZone: NgZone
  ) {
    this.registerForm = this.fb.group({
      email: [
        localStorage.getItem('email') || '',
        [Validators.email, Validators.required],
      ],
      password: ['', [Validators.required, Validators.minLength(6)]],
      signup: [false],
    });
  }
  ngOnInit(): void {
    window.google.accounts.id.initialize({
      client_id:
        '439834552359-66sd6fpdvn7ap5jmtsvobvd3mot5r096.apps.googleusercontent.com',
      callback: this.handleCredentialResponse.bind(this),
    });
    window.google.accounts.id.renderButton(
      document.getElementById('buttonDiv'),
      { theme: 'outline', size: 'large' }
    );
    window.google.accounts.id.prompt();
    this.userService.logout();
  }

  handleCredentialResponse(response: any) {
    this.userService.googleSignIn(response.credential).subscribe({
      next: () => {
        this._ngZone.run(() => {
          this.router.navigateByUrl('/');
        });
      },
      error: (e) => {
        Swal.fire({
          title: 'Error!',
          text: e.error.msg,
          icon: 'error',
        });
      },
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

  onSubmit() {
    this.userService.login(this.registerForm.value).subscribe({
      next: () => {
        if (this.getControl('signup')?.value) {
          localStorage.setItem('email', this.getControl('email')?.value);
        } else {
          localStorage.removeItem('email');
        }
        this.router.navigateByUrl('/');
      },
    });
  }

  forgotPassword() { }
}
