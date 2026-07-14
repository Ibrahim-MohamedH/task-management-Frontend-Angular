import { HttpHeaders, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { tokenKey } from '../config/constants';
import { SKIP_LOADING } from './http-context.tokens';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  let router = inject(Router);
  const token = localStorage.getItem(tokenKey);
  const newReq = req.clone({
    headers: new HttpHeaders({
      Authorization: `Bearer ${token}`,
    }),
  });
  return next(newReq).pipe(
    catchError((error) => {
      if (error.status == 401) {
        localStorage.removeItem(tokenKey);
        router.navigateByUrl('/auth');
      }
      return throwError(() => error);
    }),
  );
};
