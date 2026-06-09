import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';
import { URIS } from '../../../common/constans/uris';
import { IUser } from '../../../common/constans/models/IUser';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private http = inject(HttpClient);

  createUser(user: IUser): Observable<any> {
    return this.http.post<any>(URIS.usuarios.createUser, user)
      .pipe(catchError((error) => throwError(() => error)));
  };

  getLista(idLista:number): Observable<any> {
    return this.http.get<any>(URIS.usuarios.getLista + "/" + idLista)
      .pipe(catchError((error) => throwError(() => error)));
  };

  getCiudades(codigoPais: string): Observable<any> {
    return this.http.get<any>(URIS.usuarios.getCiudades + "/" + codigoPais)
      .pipe(catchError((error) => throwError(() => error)));
  };

  getRoles(): Observable<any> {
    return this.http.get<any>(URIS.usuarios.getRoles)
      .pipe(catchError((error) => throwError(() => error)));
  };
};
