import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';

import { environment } from '../../environments/environment';

import { Doctor } from '../models/doctor.model';
import { Collections } from './../shared/collections.enum';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DoctorService {
  public limit: number = +environment.doctorsLoadLimit;
  private url = `${environment.base_url}/${Collections.doctors}`;

  constructor(private http: HttpClient) {}

  get token() {
    return localStorage.getItem('token') || '';
  }

  transform(items: any[]): Doctor[] {
    return items.map(
      (item) =>
        new Doctor(item.name, item._id, item.image, item.user, item.hospital)
    );
  }

  getItems(skip: number = 0) {
    return this.http
      .get<{ length: number; total: number; doctors: Doctor[] }>(this.url, {
        params: {
          from: skip,
          limit: this.limit,
        },
      })
      .pipe(
        map((res) => {
          const items = this.transform(res.doctors);
          return { length: res.length, total: res.total, items };
        }),
        catchError(() => {
          return of({ length: 0, total: 0, items: null });
        })
      );
  }

  getItem(_id: string) {
    return this.http.get<any>(`${this.url}/${_id}`).pipe(
      map((res) => {
        const item = this.transform([res.doctor])[0];
        return item;
      })
    );
  }

  createItem(formData: { name: string; hospital: string }) {
    return this.http.post<any>(this.url, formData);
  }

  updateItem(formData: { name: string; hospital: string }, _id: string) {
    return this.http.put<any>(`${this.url}/${_id}`, formData);
  }

  deleteItem(_id: string) {
    return this.http.delete<any>(`${this.url}/${_id}`);
  }
}
