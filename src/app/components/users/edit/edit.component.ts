import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ChangePassComponent } from './modal/changepass/changepass.component';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { UserService } from '../services/users.service';
import { IUser } from '../../../common/constans/models/IUser';

@Component({
  selector: 'app-edit',
  standalone: true,
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css'],
  imports: [CommonModule, ReactiveFormsModule, FormsModule]
})
export class EditComponent implements OnInit{

  EditForm!: FormGroup;
  tiposPersona = [];
  tiposDocumento = [];
  tiposGenero = [];
  ciudades = [];
  roles = [];

  private modalService = inject(NgbModal);
  private userService = inject(UserService)

  ngOnInit(): void {
    this.EditForm = new FormGroup({
      'tipo_persona': new FormControl(null, Validators.required),
      'tipo_identificacion': new FormControl(null, Validators.required),
      'identificacion': new FormControl(null, Validators.required),
      'razon_social': new FormControl(null, Validators.required),
      'nombre1': new FormControl(null, Validators.required),
      'nombre2': new FormControl(null, Validators.required),
      'apellido1': new FormControl(null, Validators.required),
      'apellido2': new FormControl(null, Validators.required),
      'email': new FormControl(null, Validators.required),
      'genero': new FormControl(null, Validators.required),
      'ciudad': new FormControl(null, Validators.required),
      'telefono': new FormControl(null, Validators.required),
      'id_rol': new FormControl(null, Validators.required),
      'pass': new FormControl(null, Validators.required)
    });

    this.getTipoPersona();
    this.getTipoDocumento();
    this.getTipoGenero();
    this.getCiudades('CO');
    this.getRoles();
  }

  getTipoPersona() {
    this.userService.getLista(1).subscribe({
      next: (data) => {
        this.tiposPersona = data.lista;
      },
      error: (err) => {
        Swal.fire({
          allowOutsideClick: true,
          icon: 'error',
          title: err.error.msg,
          text: 'Error Lista tipo persona'
        });
      }
    });
  };

  getTipoDocumento() {
    this.userService.getLista(2).subscribe({
      next: (data) => {
        this.tiposDocumento = data.lista;
      },
      error: (err) => {
        Swal.fire({
          allowOutsideClick: true,
          icon: 'error',
          title: err.error.msg,
          text: 'Error Lista tipo documento'
        });
      }
    });
  };

  getTipoGenero() {
    this.userService.getLista(3).subscribe({
      next: (data) => {
        this.tiposGenero = data.lista;
      },
      error: (err) => {
        Swal.fire({
          allowOutsideClick: true,
          icon: 'error',
          title: err.error.msg,
          text: 'Error Lista tipo genero'
        });
      }
    });
  };

  getCiudades(codigoPais:string) {
    this.userService.getCiudades(codigoPais).subscribe({
      next: (data) => {
        this.ciudades = data.lista;
      },
      error: (err) => {
        Swal.fire({
          allowOutsideClick: true,
          icon: 'error',
          title: err.error.msg,
          text: 'Error Lista ciudades'
        });
      }
    });
  };

  getRoles() {
    this.userService.getRoles().subscribe({
      next: (data) => {
        this.roles = data.lista;
      },
      error: (err) => {
        Swal.fire({
          allowOutsideClick: true,
          icon: 'error',
          title: err.error.msg,
          text: 'Error Lista Roles'
        });
      }
    });
  };


  createUser() {

        Swal.fire({
          allowOutsideClick: false,
          icon: 'info',
          text: 'Creado usuario...'

        });
        Swal.showLoading();


    if (this.EditForm.invalid) {
              Swal.fire({
                allowOutsideClick: false,
                icon: 'error',
                title: 'Formulario incompleto',
                text: 'Debe completar informacion'
              });
              return
    };


    const user: IUser = { ...this.EditForm.value };

    this.userService.createUser(user).subscribe({
          next: (data) => {
                          Swal.fire({
                            icon: "success",
                            title: "Usuario creado con exito",
                            showConfirmButton: false,
                            timer: 1500
                          });

          },
          error: (err) => {
            Swal.fire({
              allowOutsideClick: true,
              icon: 'error',
              title: err.error.msg,
              text: 'Error creacion de usuario'
            });
          }
        });


  }

  openChangePass() {
    const modalref = this.modalService.open(ChangePassComponent);
  };
}
