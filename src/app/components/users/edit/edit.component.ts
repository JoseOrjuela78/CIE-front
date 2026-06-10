import { Component, inject, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ChangePassComponent } from './modal/changepass/changepass.component';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { UserService } from '../services/users.service';
import { IUser } from '../../../common/constans/models/IUser';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-edit',
  standalone: true,
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css'],
  imports: [CommonModule, ReactiveFormsModule, FormsModule]
})
export class EditComponent implements OnInit{

  @Input() userInput!:IUser;
  EditForm!: FormGroup;
  tiposPersona = [];
  tiposDocumento = [];
  tiposGenero = [];
  ciudades = [];
  roles = [];

  private modalService = inject(NgbModal);
  private userService = inject(UserService);

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
    this.loadData();
   }

  loadData(){
    Swal.fire({
          allowOutsideClick: false,
          icon: 'info',
          text: 'Cargando listas...'

        });
    Swal.showLoading();

    forkJoin({
      tiposPersona: this.userService.getLista(1),
      tiposDocumento: this.userService.getLista(2),
      tiposGenero: this.userService.getLista(3),
      ciudades: this.userService.getCiudades('CO'),
      roles: this.userService.getRoles()
    }).subscribe({
      next: (res) => {
        this.tiposPersona = res.tiposPersona.lista;
        this.tiposDocumento = res.tiposDocumento.lista;
        this.tiposGenero = res.tiposGenero.lista;
        this.ciudades = res.ciudades.lista;
        this.roles = res.roles.lista;
        Swal.close();
        
    },
     error: (err) => {
        Swal.fire({
          allowOutsideClick: true,
          icon: 'error',
          title: err.error.msg,
          text: 'Error cargue de listas'
        });
      }
    })
  }


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
