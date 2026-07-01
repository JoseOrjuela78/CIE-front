import { ChangeDetectorRef, Component, inject, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ChangePassComponent } from './modal/changepass/changepass.component';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { UserService } from '../services/users.service';
import { IUser } from '../../../common/constans/models/IUser';
import { catchError, forkJoin, of } from 'rxjs';
import { IUserFilters } from '../../../common/constans/models/IUserFilters';
import { EstadoUsuario, EstadoButton } from '../../../common/constans/enums/status.user';

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
  tiposPersona: any;
  tiposDocumento: any;
  tiposGenero: any;
  ciudades: any;
  roles: any;
  createButton!: boolean;
  passInput!: boolean;
  statusUser!: EstadoUsuario; // Pendiente, Activo, Inactivo
  statusButton!: EstadoButton; // Activar, Inactivar

  private modalService = inject(NgbModal);
  private userService = inject(UserService);
  private cd = inject(ChangeDetectorRef);

  ngOnInit(): void {
    this.createButton = false;
    this.passInput = true;
    this.statusUser = EstadoUsuario.Pendiente;
    this.statusButton = EstadoButton.Activar;

    this.EditForm = new FormGroup({
      'tipo_persona': new FormControl(null, Validators.required),
      'tipo_identificacion': new FormControl(null, Validators.required),
      'identificacion': new FormControl(null, Validators.required),
      'razon_social': new FormControl('NA', Validators.required),
      'nombre1': new FormControl(null, Validators.required),
      'nombre2': new FormControl(null, Validators.required),
      'apellido1': new FormControl(null, Validators.required),
      'apellido2': new FormControl(null, Validators.required),
      'email': new FormControl(null, Validators.required),
      'genero': new FormControl(null, Validators.required),
      'ciudad': new FormControl(null, Validators.required),
      'telefono': new FormControl(null, Validators.required),
      'id_rol': new FormControl(null, Validators.required),
      'pass': new FormControl(null, Validators.required),
      'id_usuario': new FormControl(null, Validators.required)
    });
    this.loadData();
  }

loadData() {
  Swal.fire({
    allowOutsideClick: false,
    icon: 'info',
    text: 'Cargando listas...'
  });
  Swal.showLoading();

  forkJoin({
    tiposPersona: this.userService.getLista(1).pipe(
      catchError(err => {
        Swal.fire({
          icon: 'error',
          title: 'Error en tiposPersona',
          text: err.error?.msg || 'No se pudo cargar la lista de tipos de persona'
        });
        return of({ lista: [] });
      })
    ),
    tiposDocumento: this.userService.getLista(2).pipe(
      catchError(err => {
        Swal.fire({
          icon: 'error',
          title: 'Error en tiposDocumento',
          text: err.error?.msg || 'No se pudo cargar la lista de tipos de documento'
        });
        return of({ lista: [] });
      })
    ),
    tiposGenero: this.userService.getLista(3).pipe(
      catchError(err => {
        Swal.fire({
          icon: 'error',
          title: 'Error en tiposGenero',
          text: err.error?.msg || 'No se pudo cargar la lista de géneros'
        });
        return of({ lista: [] });
      })
    ),
    ciudades: this.userService.getCiudades('CO').pipe(
      catchError(err => {
        Swal.fire({
          icon: 'error',
          title: 'Error en ciudades',
          text: err.error?.msg || 'No se pudo cargar la lista de ciudades'
        });
        return of({ lista: [] });
      })
    ),
    roles: this.userService.getRoles({
      ordercolumn: null,
      orderdirection: null,
      pagenumber: null,
      pagesize: null,
      id_rol: null,
      nombre_rol: null,
      descripcion: null,
      estado: 1,
      fechainicio: null,
      fechafinal: null
    }).pipe(
      catchError(err => {
        Swal.fire({
          icon: 'error',
          title: 'Error en roles',
          text: err.error?.msg || 'No se pudo cargar la lista de roles'
        });
        return of({ lista: [] });
      })
    )
  }).subscribe({
    next: (res) => {
      this.tiposPersona = res.tiposPersona?.lista;
      this.tiposDocumento = res.tiposDocumento.lista;
      this.tiposGenero = res.tiposGenero.lista;
      this.ciudades = res.ciudades.lista;
      this.roles = res.roles.lista;
      this.cd.detectChanges();
      Swal.close();
    }
  });
}

/*
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
      roles: this.userService.getRoles({
                                        ordercolumn: null,
                                        orderdirection: null,
                                        pagenumber: null,
                                        pagesize: null,
                                        id_rol: null,
                                        nombre_rol: null,
                                        descripcion: null,
                                        estado: 1,
                                        fechainicio: null,
                                        fechafinal: null
                                       })
    }).subscribe({
      next: (res) => {
        this.tiposPersona = res.tiposPersona.lista;
        this.tiposDocumento = res.tiposDocumento.lista;
        this.tiposGenero = res.tiposGenero.lista;
        this.ciudades = res.ciudades.lista;
        this.roles = res.roles.lista;
        this.cd.detectChanges();
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
*/
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
                          this.getUser();
                          Swal.fire({
                            icon: "success",
                            title: "Usuario creado con exito",
                            showConfirmButton: false,
                            timer: 1500
                          });

          },
        error: (err) => {
            this.statusUser = EstadoUsuario.Pendiente;
            Swal.fire({
              allowOutsideClick: true,
              icon: 'error',
              title: err.error.msg,
              text: 'Error creacion de usuario'
            });
          }
        });


}

getUser() {

    Swal.fire({
      allowOutsideClick: false,
      icon: 'info',
      text: 'Buscando usuario...'

    });
    Swal.showLoading();

  let filter: IUserFilters = {
    ordercolumn: null,
    orderdirection: null,
    pagenumber: null,
    pagesize: null,
    identificacion: null,
    id_usuario: null,
    tipo_persona: null,
    tipo_identificacion: null,
    razon_social: null,
    nombre: null,
    email: null,
    genero: null,
    ciudad: null,
    telefono: null,
    id_rol: null,
    estado: null,
    fechainicio: null,
    fechafinal: null,
    };
    filter.identificacion = this.EditForm.value.identificacion;

    this.userService.getUsers(filter) .subscribe({
      next: (data) => {
        this.createButton = true;
        this.passInput = false;

        if (data.users.ESTADO) {
          this.statusUser = EstadoUsuario.Activo
          this.statusButton = EstadoButton.Inactivar;
        } else {
          this.statusUser = EstadoUsuario.Inactivo;
          this.statusButton = EstadoButton.Activar;
        };

        this.EditForm.patchValue({
          tipo_persona: data.users.TIPO_PERSONA,
          tipo_identificacion: data.users.TIPO_IDENTIFICACION,
          razon_social: data.users.RAZON_SOCIAL,
          nombre1: data.users.NOMBRE1,
          nombre2: data.users.NOMBRE2,
          apellido1: data.users.APELLIDO1,
          apellido2: data.users.APELLIDO2,
          email: data.users.EMAIL,
          genero: data.users.GENERO,
          ciudad: data.users.CIUDAD,
          telefono: data.users.TELEFONO,
          id_rol: data.users.ID_ROL,
          pass: 'N/A',
          id_usuario: data.users.ID_USUARIO
        });

        Swal.close();

      },
      error: (err) => {
        this.createButton = false;
        this.passInput = true;
        this.statusUser = EstadoUsuario.Pendiente;
        this.statusButton = EstadoButton.Activar;

        this.EditForm.patchValue({
          tipo_persona: null,
          tipo_identificacion: null,
          razon_social: null,
          nombre1: null,
          nombre2: null,
          apellido1: null,
          apellido2: null,
          email: null,
          genero: null,
          ciudad: null,
          telefono: null,
          id_rol: null,
          pass: null,
          id_usuario:null
        });

        Swal.fire({
          allowOutsideClick: true,
          icon: 'error',
          title: err.error.msg,
          text: 'Error buscando de usuario'
        });
      }
    });



  };

updateUser() {

    Swal.fire({
      allowOutsideClick: false,
      icon: 'info',
      text: 'Actualizando usuario...'

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

    this.userService.updateUser(user).subscribe({
      next: (data) => {
        this.getUser();
        Swal.fire({
          icon: "success",
          title: data.msg,
          showConfirmButton: false,
          timer: 1500
        });
      },
      error: (err) => {
        this.statusUser = EstadoUsuario.Pendiente;
        this.statusButton = EstadoButton.Activar;
        Swal.fire({
          allowOutsideClick: true,
          icon: 'error',
          title: err.error.msg,
          text: 'Error actualizando de usuario'
        });
      }
    });

  }

stsUser() {

    Swal.fire({
      allowOutsideClick: false,
      icon: 'info',
      text: 'Actualizando usuario...'

    });
  Swal.showLoading();

  let sts: boolean = true;
  if (this.statusButton === 'Inactivar') sts = false;

  this.userService.statusUser(this.EditForm.value.identificacion, sts).subscribe({
      next: (data) => {
        this.getUser();
        Swal.fire({
          icon: "success",
          title: data.msg,
          showConfirmButton: false,
          timer: 1500
        });
      },
      error: (err) => {
        this.statusUser = EstadoUsuario.Pendiente;
        this.statusButton = EstadoButton.Activar;
        Swal.fire({
          allowOutsideClick: true,
          icon: 'error',
          title: err.error.msg,
          text: 'Error actualizando de usuario'
        });
      }
    });

  }


openChangePass() {
    const modalref = this.modalService.open(ChangePassComponent,{ backdrop: 'static', // evita cerrar al hacer clic fuera
                                                                  keyboard: false     // desactiva cerrar con ESC
                                                                 });
  modalref.componentInstance.id_usuario = this.EditForm.value.id_usuario;
     // Capturar resultado al cerrar
    modalref.result.then(
      (result) => {
        console.log('Modal actualizado:', result);
        // aquí puedes refrescar lista, guardar cambios, etc.
      },
      (reason) => {
        console.log('Modal cancelado:', reason);
      }
    );
};

}
