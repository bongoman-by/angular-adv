import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { environment } from '../../environments/environment';

import { SidebarService } from './sidebar.service';

import { IRegisterForm } from '../interfaces/register-form.interface';
import { ILoginForm } from '../interfaces/login-form.interface';
import { IProfileSettingsForm } from '../interfaces/profile-settings-form.interface';
import { User } from '../models/user.model';
import { Collections } from '../shared/collections.enum';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  public user!: User;
  public limit: number = +environment.usersLoadLimit;
  private url = `${environment.base_url}/${Collections.users}`;

  constructor(
    private http: HttpClient,
    private sidebarService: SidebarService
  ) {}

  saveResult(res: any) {
    localStorage.setItem('token', res.token);
    this.sidebarService.setMenu(res.menu);
  }

  get role() {
    return this.user.role;
  }

  setUser(user: any) {
    const { name, email, image, google, role, uid } = user;
    this.user = new User(name, email, '', image, google, role, uid);
  }

  checkToken(): Observable<boolean> {
    const endPoint = `${environment.base_url}/login/renew`;
    return this.http.get<any>(endPoint).pipe(
      map((res) => {
        this.setUser(res.user);
        this.saveResult(res);
        return true;
      }),
      catchError((err) => of(false))
    );
  }

  transform(items: any[]): User[] {
    return items.map(
      (item) =>
        new User(
          item.name,
          item.email,
          '',
          item.image,
          item.google,
          item.role,
          item.uid
        )
    );
  }

  getItems(skip: number = 0) {
    const endPoint = `${environment.base_url}/users`;
    return this.http
      .get<{ total: number; users: User[] }>(this.url, {
        params: {
          from: skip,
          limit: this.limit,
        },
      })
      .pipe(
        map((res) => {
          const items = this.transform(res.users);
          return { total: res.total, items };
        }),
        catchError(() => {
          return of({ total: 0, items: null });
        })
      );
  }

  login(formData: ILoginForm) {
    return this.http.post<any>(`${environment.base_url}/login`, formData).pipe(
      tap((res) => {
        this.saveResult(res);
      })
    );
  }

  googleSignIn(token: string) {
    return this.http
      .post<any>(`${environment.base_url}/login/google`, { token })
      .pipe(
        tap((res) => {
          this.saveResult(res);
        })
      );
  }

  updateRole(user: User) {
    const profileSettings: IProfileSettingsForm = {
      email: user.email,
      name: user.name,
      oldPassword: '',
      password: '',
      role: user.role,
    } as IProfileSettingsForm;
    return this.http.put<any>(`${this.url}/${user.uid}`, profileSettings);
  }

  logout() {
    localStorage.removeItem('token');
  }
  createItem(formData: IRegisterForm) {
    return this.http.post<any>(this.url, formData).pipe(
      tap((res) => {
        this.saveResult(res);
      })
    );
  }

  updateItem(formData: IProfileSettingsForm) {
    formData.role = this.user.role || '';
    return this.http.put<any>(`${this.url}/${this.user.uid || ''}`, formData);
  }

  deleteItem(uid: string) {
    return this.http.delete<any>(`${this.url}/${uid}`);
  }
}
