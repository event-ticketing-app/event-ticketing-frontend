import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { catchError, throwError } from 'rxjs';
import { Auth } from '../services/auth';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const platformId = inject(PLATFORM_ID);
  const auth = inject(Auth);

  if (!isPlatformBrowser(platformId)) {
    return next(req);
  }
  const token = localStorage.getItem('token');

  if (!token) {
    return next(req);
  }
  const modifiedReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });

  return next(modifiedReq).pipe(
    catchError((err: HttpErrorResponse) => {
      // 401 = the backend rejected our token (expired or invalid), so the session is over.
      // Login/register are skipped: there a 401 just means wrong credentials.
      if (err.status === 401 && !req.url.includes('/api/auth/')) {
        auth.expireSession();
      }
      return throwError(() => err);
    })
  );
};
