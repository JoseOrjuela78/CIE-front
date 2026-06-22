import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UploadService } from './services/upload.service';
import Swal from 'sweetalert2';
import { forkJoin } from 'rxjs';
import { IUser } from '../../common/constans/models/IUser';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EditComponent } from '../users/edit/edit.component';

@Component({
  selector: 'app-upload',
  standalone: true,
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css'],
  imports:[CommonModule, ReactiveFormsModule, FormsModule]
})
export class UploadComponent implements OnInit{

   UserForm!: FormGroup;
   arrTitles:any = [];
   arrRows:any = [];
   tableSelected: string = "";
   buttonUser: boolean = false;
   arrTables:any = [];

  private uploadService = inject(UploadService);
  private modalService = inject(NgbModal);

  ngOnInit(): void {
        this.UserForm = new FormGroup({
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
    this.arrTables = [ "DescuentosVolumen","Listadetalle","Monedas","Parametros","Proveedores","RangosUSD","Tarifas","Trm","Zonas"];
      //this.loadData("Tables_est");
  };

   loadData(table:string){
      Swal.fire({
            allowOutsideClick: false,
            icon: 'info',
            text: `Cargando tabla : ${table}`

          });
      Swal.showLoading();

      this.arrTitles= [];
      this.arrRows = [];

      forkJoin({
        tableEst: this.uploadService.getTable(table)

      }).subscribe({
        next: (res) => {
          console.log({ res });
          this.arrTitles = Object.keys(JSON.parse(res.tableEst.data)[0]);

          if (table == "Usuarios") {
            let index = 1;
            this.arrTitles.splice(index, 2);
            index = 8;
            this.arrTitles.splice(index, 1);
            this.arrTitles.push('Acciones');
            };

          this.arrRows = JSON.parse(res.tableEst.data);
          Swal.fire({
                      allowOutsideClick: true,
                      icon: 'info',
                      title: 'Info',
                      text: res.tableEst.message
                    });
       },
       error: (err) => {
          Swal.fire({
            allowOutsideClick: true,
            icon: 'error',
            title: err.error.msg,
            text: `Error cargando tabla :${table}`
          });
        }
      })
    }

    putTable(){

      Swal.fire({
                allowOutsideClick: false,
                icon: 'info',
                text: `Cargando tabla : ${this.tableSelected}`
               });
      Swal.showLoading();

      this.uploadService.putTable(this.tableSelected).subscribe({
        next: (res) => {

                  if (res.status == 201) {
                    Swal.fire({
                              allowOutsideClick: true,
                              icon: 'error',
                              title: 'Error',
                              text: res.body.msg
                    })
                    return;
                  };

                  if (this.tableSelected != "Usuarios")this.tableSelected = "Tables_est";

                  this.loadData(this.tableSelected);

       },
       error: (err) => {
          Swal.fire({
            allowOutsideClick: true,
            icon: 'error',
            title: err.error.msg,
            text: `Error actualizando tabla: ${this.tableSelected}`
          });
        }
      })
};

buttonStatus(status: boolean) {
    this.buttonUser = status;
    if (status)this.UserForm.reset();
};

getUsuario(user:IUser){
  this.UserForm.patchValue(user);
  return this.buttonStatus(false);
};

createUsuario() {

      Swal.fire({
        allowOutsideClick: false,
        icon: 'info',
        text:'Creando usuario...'

      });
      Swal.showLoading();

      this.uploadService.createUser(this.UserForm.value).subscribe({
         next: (data) => {
                   if (data.status == 201){
                                          Swal.fire({
                                                    allowOutsideClick: true,
                                                    icon: 'error',
                                                    title: 'Error',
                                                    text: data.body.msg
                                                    });
                                          return;
                                          };

                    this.loadData("Usuarios");

         },
         error: (err) => {
                          Swal.fire({
                          allowOutsideClick: true,
                          icon: 'error',
                          title: err.error.msg,
                          text: `Error creando usuario`
                         });
                      }
      });

};

updateUsuario() {

    Swal.fire({
              allowOutsideClick: false,
              icon: 'info',
              text:'Actualizando usuario...'

      });
      Swal.showLoading();

      this.uploadService.updateUser(this.UserForm.value).subscribe({
         next: (data) => {
                  if (data.status == 201){
                                          Swal.fire({
                                                    allowOutsideClick: true,
                                                    icon: 'error',
                                                    title: 'Error',
                                                    text: data.body.msg
                                                    });
                                          return;
                                          };
              this.loadData("Usuarios");

         },
         error: (err) => {
                          Swal.fire({
                          allowOutsideClick: true,
                          icon: 'error',
                          title: err.error.msg,
                          text: `Error actualizando usuario`
                         });
                      }
      });
}

  openUserForm() {
    const modalref = this.modalService.open(EditComponent,{ size: 'lg' });
   //const user: IUser ={
    //}
    //modalref.componentInstance.userInput = user;
  };
}
