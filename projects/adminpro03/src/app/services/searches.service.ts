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

  getCollection(type: Collections, term: string) {
    return this.http
      .get<any[]>(`${environment.base_url}/search/collection/${type}/${term}`)
      .pipe(
        map((res: any) => {
          return res.searchResult;
        })
      );
  }

  getAll(term: string) {
    return this.http.get<any>(`${environment.base_url}/search/${term}`);
  }
}
