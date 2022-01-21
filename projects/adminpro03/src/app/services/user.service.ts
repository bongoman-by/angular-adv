import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { environment } from '../../environments/environment';

import { IRegisterForm } from '../interfaces/register-form.interface';
import { ILoginForm } from '../interfaces/login-form.interface';
import { IProfileSettingsForm } from '../interfaces/profile-settings-form.interface';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  public user!: User;
  public limit: number = +environment.usersLoadLimit;

  constructor(private http: HttpClient) {}

  get token() {
    return localStorage.getItem('token') || '';
  }

  setUser(user: any) {
    const { name, email, image, google, role, uid } = user;
    this.user = new User(name, email, '', image, google, role, uid);
  }

  checkToken(): Observable<boolean> {
    if (!this.token) {
      return of(false);
    }

    const endPoint = `${environment.base_url}/login/renew`;
    return this.http
      .get<any>(endPoint, { headers: { 'x-token': this.token } })
      .pipe(
        map((res) => {
          this.setUser(res.user);
          localStorage.setItem('token', res.token);
          return true;
        }),
        catchError((err) => of(false))
      );
  }

  transformUsers(users: any[]): User[] {
    return users.map(
      (user) =>
        new User(
          user.name,
          user.email,
          '',
          user.image,
          user.google,
          user.role,
          user.uid
        )
    );
  }

  getUsers(skip: number = 0) {
    const endPoint = `${environment.base_url}/users`;
    return this.http
      .get<{ total: number; users: User[] }>(endPoint, {
        headers: { 'x-token': this.token },
        params: {
          from: skip,
          limit: this.limit,
        },
      })
      .pipe(
        map((res) => {
          const users = this.transformUsers(res.users);
          return { total: res.total, users };
        })
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

  updateUser(formData: IProfileSettingsForm) {
    if (!this.token) {
      return of(false);
    }
    formData.role = this.user.role || '';
    const endPoint = `${environment.base_url}/users/${this.user.uid || ''}`;
    return this.http.put<any>(endPoint, formData, {
      headers: { 'x-token': this.token },
    });
  }

  deleteUser(uid: string) {
    if (!this.token) {
      return of(false);
    }
    const endPoint = `${environment.base_url}/users/${uid}`;
    return this.http.delete<any>(endPoint, {
      headers: { 'x-token': this.token },
    });
  }

  updateRole(user: User) {
    if (!this.token) {
      return of(false);
    }
    const profileSettings: IProfileSettingsForm = {
      email: user.email,
      name: user.name,
      oldPassword: '',
      password: '',
      role: user.role,
    } as IProfileSettingsForm;

    const endPoint = `${environment.base_url}/users/${user.uid}`;
    return this.http.put<any>(endPoint, profileSettings, {
      headers: { 'x-token': this.token },
    });
  }

  logout() {
    localStorage.removeItem('token');
  }
}
