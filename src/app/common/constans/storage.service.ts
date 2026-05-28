import { Injectable, inject } from '@angular/core';
import { sessionData } from './enums/storage.enum';

@Injectable({
  providedIn: 'root' // disponible en toda la app
})
export class StorageService {

  cargarSesion(body:any) {
    sessionStorage.setItem(sessionData.rol, body.rol);
    sessionStorage.setItem(sessionData.nombreUsuario, body.nombreUsuario);
    sessionStorage.setItem(sessionData.token, body.token);
    return true
  };

  cerrarSesion() {
    sessionStorage.removeItem(sessionData.rol);
    sessionStorage.removeItem(sessionData.nombreUsuario);
    sessionStorage.removeItem(sessionData.token);
    return true
  };
}
