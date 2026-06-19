import { Component, inject, OnInit} from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from "@angular/router";
import { StorageService } from '../../../common/constans/storage.service';
import { sessionData } from '../../../common/constans/enums/storage.enum';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  imports: [CommonModule, RouterLink]
})
export class NavbarComponent implements OnInit {

  menus: any;

  private storageService = inject(StorageService);
  private router = inject(Router);

  ngOnInit(): void {
    const arr: any = sessionStorage.getItem(sessionData.menus) ? sessionStorage.getItem(sessionData.menus) : '[]';
    this.menus = JSON.parse(arr);
  }


  closeSession() {
    this.storageService.cerrarSesion();
    return this.router.navigate(['/login']);
  }

}
