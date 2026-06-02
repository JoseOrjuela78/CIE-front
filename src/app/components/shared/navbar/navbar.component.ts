import { Component, inject} from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from "@angular/router";
import { StorageService } from '../../../common/constans/storage.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  imports: [RouterLink, RouterLinkActive]
})
export class NavbarComponent {

  private storageService = inject(StorageService);
  private router = inject(Router);

  closeSession() {
    this.storageService.cerrarSesion();
    return this.router.navigate(['/login']);
  }

}
