// auth-timeout.interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';
import { timeout } from 'rxjs/operators';
import { sessionData } from '../constans/enums/storage.enum';
import { Router } from '@angular/router';
import { inject } from '@angular/core';

export const httpInterceptor: HttpInterceptorFn = (req, next) => {

  const router = inject(Router);
  const token = sessionStorage.getItem(sessionData.token)?sessionStorage.getItem(sessionData.token):"";

  let modifiedReq = req;

  // Agregar Authorization si existe token
  if (token != "") {
    modifiedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  } else {
    router.navigate(['/login']);
  }

  // Aplicar timeout (ejemplo: 10 segundos)
  return next(modifiedReq).pipe(
    timeout(10000) // milisegundos
  );
};
