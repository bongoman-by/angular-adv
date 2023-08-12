import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
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
    let outReq: any;
    if (
      !this.token ||
      (request.url.includes('login') && !request.url.includes('renew'))
    ) {
      outReq = next.handle(request);
    } else {
      const tokenReq = request.clone({
        headers: request.headers.set('x-token', this.token),
      });
      outReq = next.handle(tokenReq);
    }
    return outReq.pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMsg = '';
        let title = '';
        if (error.error instanceof ErrorEvent) {
          title = 'Client side error';
          errorMsg = `Error: ${error.error.message}`;
        } else {
          title = 'Server side error';
          errorMsg = `Error Code: ${error.status},  Message: ${
            error.error.msg || error.message
          }`;
        }
        Swal.fire({
          title: title,
          text: `Error from interceptor: ${errorMsg}`,
          icon: 'error',
        });

        return throwError(() => new Error(errorMsg));
      })
    );
  }
}
