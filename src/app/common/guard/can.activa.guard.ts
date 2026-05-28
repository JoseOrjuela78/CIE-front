import { CanActivateFn, Router } from "@angular/router";
import { inject } from "@angular/core";
import { AuthService } from './auth.service';
import { sessionData } from "../constans/enums/storage.enum";

export const authGuard: CanActivateFn = (route, state) => {

  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.validarToken(sessionStorage.getItem(sessionData.token))) {
    return true;

  }
  else {
    router.navigate(['/login']);
    return false;
  };

};
