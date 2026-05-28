import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root' // disponible en toda la app
})
export class AuthService {
  // 👇 Inyección directa con inject()
  private http = inject(HttpClient);

  validarToken(token: string|null) {
    if (token === null || token === undefined) return false;
    if (typeof token === 'string' && token.trim() === '') return false;
    return true;
  };
}
