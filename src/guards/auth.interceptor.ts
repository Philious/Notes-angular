import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const token = authService.token();

  // eslint-disable-next-line @typescript-eslint/naming-convention
  const modified = token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req;

  return next(modified).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status === 401) {
        authService.removeToken();
        router.navigate(['/login']);
      }
      return throwError(() => err);
    }),
  );
};
