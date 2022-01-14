import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

import { IRegisterForm } from '../interfaces/register-form.interface';
import { ILoginForm } from '../interfaces/login-form.interface';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  checkToken(): Observable<boolean> {
    const token = localStorage.getItem('token') || '';
    if (!token) {
      return of(false);
    }
    const endPoint = `${environment.base_url}/login/renew`;
    return this.http.get<any>(endPoint, { headers: { 'x-token': token } }).pipe(
      tap((res) => {
        localStorage.setItem('token', res.token);
      }),
      map((res) => true),
      catchError((err) => of(false))
    );
  }

  createUser(formData: IRegisterForm) {
    const endPoint = `${environment.base_url}/users`;
    return this.http.post<any>(endPoint, formData).pipe(
      tap((res) => {
        localStorage.setItem('token', res.token);
      })
    );
  }

  login(formData: ILoginForm) {
    const endPoint = `${environment.base_url}/login`;
    return this.http.post<any>(endPoint, formData).pipe(
      tap((res) => {
        localStorage.setItem('token', res.token);
      })
    );
  }

  googleSignIn(token: string) {
    const endPoint = `${environment.base_url}/login/google`;
    return this.http.post<any>(endPoint, { token }).pipe(
      tap((res) => {
        localStorage.setItem('token', res.token);
      })
    );
  }

  logout() {
    localStorage.removeItem('token');
  }
}
