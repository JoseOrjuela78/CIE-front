import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { LoginService } from './services/login.service';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { StorageService } from '../../common/constans/storage.service';
import { Router } from '@angular/router';

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
  }


}
