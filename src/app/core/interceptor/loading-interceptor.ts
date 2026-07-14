import { HttpInterceptorFn } from '@angular/common/http';
import { Busy } from '../services/settings/busy';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';
import { SKIP_LOADING } from './http-context.tokens';
export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const busy = inject(Busy);

  const skipLoading = req.context.get(SKIP_LOADING);

  if (!skipLoading) {
    busy.show();
  }

  return next(req).pipe(
    finalize(() => {
      if (!skipLoading) {
        busy.hide();
      }
    })
  );
};
