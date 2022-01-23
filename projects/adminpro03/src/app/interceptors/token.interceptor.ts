import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
  HttpResponse,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import Swal from 'sweetalert2';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor() {}

  get token() {
    return localStorage.getItem('token') || '';
  }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (!this.token || request.url.includes('login')) {
      return next.handle(request);
    }
    const tokenReq = request.clone({
      headers: request.headers.set('x-token', this.token),
    });
    return next.handle(tokenReq).pipe(
      tap((err) => {
        if (err instanceof HttpErrorResponse) {
          Swal.fire({
            title: 'Error!',
            text: err.message,
            icon: 'error',
          });
        }
      })
    );
  }
}
