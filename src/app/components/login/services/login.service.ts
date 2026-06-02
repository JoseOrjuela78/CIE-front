import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';
import { URIS } from '../../../common/constans/uris';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private http = inject(HttpClient);

  login(username:string, pass:string): Observable<any> {
    return this.http.post<any>(URIS.usuarios.login, { username, pass })
      .pipe(catchError((error) => throwError(() => error)));
  }
};
