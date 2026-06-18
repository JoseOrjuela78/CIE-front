import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { LoginService } from './services/login.service';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { StorageService } from '../../common/constans/storage.service';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ChangePassComponent } from '../users/edit/modal/changepass/changepass.component';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [CommonModule, ReactiveFormsModule, FormsModule]
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;

  private loginService = inject(LoginService);
  private storageService = inject(StorageService);
  private router = inject(Router);
  private modalService = inject(NgbModal);

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      'email': new FormControl(null, Validators.required),
      'pass': new FormControl(null, Validators.required)
    });
  };

  login() {

    Swal.fire({
      allowOutsideClick: false,
      icon: 'info',
      text: 'Validando credenciales...'

    });
    Swal.showLoading()

    this.loginService.login(this.loginForm.value.email, this.loginForm.value.pass).subscribe({
      next: (data) => {
        const body = {
          rol: data.user.ID_ROL,
          nombreUsuario: data.user.NOMBRE1 + ' ' + data.user.APELLIDO1,
          token: data.token
        };
    
        // si passworg vencido
        if(true){
          return this.openChangePass('123')
        };

        this.storageService.cargarSesion(body);
        this.router.navigate(['/']);
        Swal.close();
      },
      error: (err) => {
        Swal.fire({
          allowOutsideClick: true,
          icon: 'error',
          title: err.error.msg,
          text: 'Error De Autenticación'
        });
      }
    });
  };

  openChangePass(identificacion:string) {
    const modalref = this.modalService.open(ChangePassComponent,{ backdrop: 'static', // evita cerrar al hacer clic fuera
                                                                  keyboard: false     // desactiva cerrar con ESC
                                                                 });
    modalref.componentInstance.identificacion = identificacion;//this.EditForm.value.identificacion;
     // Capturar resultado al cerrar
    modalref.result.then(
      (result) => {
        console.log('Modal actualizado:', result);
        this.closeSession();
        // aquí puedes refrescar lista, guardar cambios, etc.
      },
      (reason) => {
        console.log('Modal cancelado:', reason);
        this.closeSession();
      }
    );
};

 closeSession() {
    this.storageService.cerrarSesion();
    return this.router.navigate(['/login']);
 };

}
