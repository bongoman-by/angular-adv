import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { environment } from '../../environments/environment';

import { Hospital } from '../models/hospital.model';
import { Collections } from './../shared/collections.enum';

@Injectable({
  providedIn: 'root',
})
export class HospitalService {
  public limit: number = +environment.hospitalsLoadLimit;
  private url = `${environment.base_url}/${Collections.hospitals}`;

  constructor(private http: HttpClient) {}

  get token() {
    return localStorage.getItem('token') || '';
  }

  transform(items: any[]): Hospital[] {
    return items.map(
      (item) => new Hospital(item.name, item._id, item.user, item.image)
    );
  }

  getItems(skip: number = 0) {
    return this.http
      .get<{ length: number; hospitals: Hospital[] }>(this.url)
      .pipe(
        map((res) => {
          const items = this.transform(res.hospitals);
          return { total: res.length, items };
        })
      );
  }

  createItem(formData: { name: string }) {
    return this.http.post<any>(this.url, formData);
  }

  updateItem(formData: { name: string; user: string }, _id: string) {
    return this.http.put<any>(`${this.url}/${_id}`, formData);
  }

  deleteItem(_id: string) {
    return this.http.delete<any>(`${this.url}/${_id}`);
  }
}
