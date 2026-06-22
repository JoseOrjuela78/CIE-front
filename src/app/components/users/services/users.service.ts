import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';
import { URIS } from '../../../common/constans/uris';
import { IUser } from '../../../common/constans/models/IUser';
import { IUserFilters } from '../../../common/constans/models/IUserFilters';
import { IRolesFilters } from '../../../common/constans/models/IRolesFilters';
import { IUserFiltersRestricted } from '../../../common/constans/models/IUserFiltersRestricted';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private http = inject(HttpClient);

  createUser(user: IUser): Observable<any> {
    return this.http.post<any>(URIS.usuarios.createUser, user)
      .pipe(catchError((error) => throwError(() => error)));
  };

  updateUser(user: IUser): Observable<any> {
    return this.http.put<any>(URIS.usuarios.updateUser, user)
      .pipe(catchError((error) => throwError(() => error)));
  };

  statusUser(identificacion: string, estado:boolean): Observable<any> {
    return this.http.put<any>(URIS.usuarios.statusUser, { identificacion, estado })
      .pipe(catchError((error) => throwError(() => error)));
  };

  passwordUser(id_usuario: number, pass: string): Observable<any> {
    return this.http.post<any>(URIS.usuarios.passwordUser, { id_usuario, pass })
      .pipe(catchError((error) => throwError(() => error)));
  };

  getUsers(filters: IUserFilters): Observable<any> {
    return this.http.put<any>(URIS.usuarios.getUsers, filters)
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

  getRoles(filters: IRolesFilters): Observable<any> {
    return this.http.put<any>(URIS.usuarios.getRoles, filters)
      .pipe(catchError((error) => throwError(() => error)));
  };

  getMenus(idRol:number): Observable<any> {
    return this.http.get<any>(URIS.usuarios.getMenus + "/" + idRol)
      .pipe(catchError((error) => throwError(() => error)));
  };

  createPermitsRol(permisos: string): Observable<any> {
    const body = {
      permisos
    };
    return this.http.post<any>(URIS.usuarios.createPermitsRol, body)
      .pipe(catchError((error) => throwError(() => error)));
  };

  createRol(nombre_rol: string,descripcion: string): Observable<any> {
    const body = {
      nombre_rol,
      descripcion
    };
    return this.http.post<any>(URIS.usuarios.createRol, body)
      .pipe(catchError((error) => throwError(() => error)));
  };

  statusRol(id_rol: string, estado: number): Observable<any> {
    return this.http.put<any>(URIS.usuarios.statusRol, { id_rol, estado })
      .pipe(catchError((error) => throwError(() => error)));
  };

  getUsersRestricted(filters: IUserFiltersRestricted): Observable<any> {
    return this.http.put<any>(URIS.usuarios.getUsersRestricted, filters)
      .pipe(catchError((error) => throwError(() => error)));
  };

  deleteRestriction(id_usuario: number,codigo: number): Observable<any> {
    return this.http.put<any>(URIS.usuarios.deleteRestriction, { id_usuario, codigo })
      .pipe(catchError((error) => throwError(() => error)));
  };

  createRestriction(id_usuario: number, codigo: number): Observable<any> {
    return this.http.post<any>(URIS.usuarios.createRestriction, { id_usuario, codigo })
      .pipe(catchError((error) => throwError(() => error)));
  };
};
