import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { Collections } from '../shared/collections.enum';

@Injectable({
  providedIn: 'root',
})
export class SearchesService {
  constructor(private http: HttpClient) {}

  get token() {
    return localStorage.getItem('token') || '';
  }

  get headers() {
    return { headers: { 'x-token': this.token } };
  }

  getCollection(type: Collections, term: string) {
    const endPoint = `${environment.base_url}/search/collection/${type}/${term}`;

    return this.http
      .get<any[]>(endPoint, {
        headers: { 'x-token': this.token },
      })
      .pipe(
        map((res: any) => {
          return res.searchResult;
        })
      );
  }
}
