import { CommonModule } from "@angular/common";
import { ChangeDetectorRef, Component, inject, Input, OnInit } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DataTable } from "../../../../common/constans/models/IDataTable";
import Swal from 'sweetalert2';
import { UserService } from "../../services/users.service";
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-editarol',
  standalone: true,
  templateUrl: './editarol.component.html',
  styleUrls: ['./editarol.component.css'],
  imports:[CommonModule, ReactiveFormsModule, FormsModule]
})
export class EditRolComponent implements OnInit {

    menusArr:any = [];
    actionsArr:any=[];
    titulo!: string;
    comentarios!: string;
    estado: boolean = false;
    checkInput: boolean = false;
    datatable!: DataTable;
    idSeleccionado:number = 0;

  @Input() dataRol!: any;
  private userService = inject(UserService);
  private cd = inject(ChangeDetectorRef);
  private activeModal = inject(NgbActiveModal);

  ngOnInit(): void {
        this.estado = this.dataRol.estado;
        this.datatable = {
        headerRows: {
                    Titulo: "Titulo",
                    Permisos: "Permisos"
                  },
                    dataRows: []
        };
        this.titulo = this.dataRol.titulo;

    if (this.dataRol.idRol != 0)this.getMenus(this.dataRol.idRol);
   };

  //Construye objeto base
  getMenus(idRol:number) {
    this.userService.getMenus(idRol).subscribe({
      next: (res) => {
        this.datatable.dataRows = res.rolSchema;
        this.cd.detectChanges();
        console.log(this.datatable.dataRows);
      },
      error: (err) => {

                           Swal.fire({
                             allowOutsideClick: true,
                             icon: 'error',
                             title: err.error.msg,
                             text: `Error cargardo menus`
                           });
                          }
    })

}

updatePermiso(idmenu:number,codigo:number,permiso:boolean){

        for(let e in this.datatable.dataRows){
            if(this.datatable.dataRows[e].idMenu === idmenu ){
                for(let i in this.datatable.dataRows[e].idAction){
                    if(this.datatable.dataRows[e].idAction[i].codigo === codigo){
                        this.datatable.dataRows[e].idAction[i].status = permiso;
                        break;
                    };
                };
            };
        };
      console.log(this.datatable.dataRows);
};

guardarRol() {

    Swal.fire({
      allowOutsideClick: false,
      icon: 'info',
      text: 'Actualizando permisos...'
    });
    Swal.showLoading();

    const permits = JSON.stringify(this.datatable.dataRows);
    this.userService.createPermitsRol(permits).subscribe({
      next: (res) => {
        const status = this.estado ? 1 : 0;
        this.userService.statusRol(this.dataRol.idRol, status).subscribe({
          next: (result) => {
            this.activeModal.close('actualizado')
            Swal.fire({
              allowOutsideClick: true,
              icon: 'info',
              title: res.msg,
              text: res.msg,
            });
          },
          error: (err) => {

            Swal.fire({
              allowOutsideClick: true,
              icon: 'error',
              title: err.error.msg,
              text: `Error actualizando estado rol`
            });
          }
         })

       },
      error: (err) => {

      Swal.fire({
        allowOutsideClick: true,
        icon: 'error',
        title: err.error.msg,
        text: `Error cargardo permisos rol`
      });
    }
  })
  };

  crearRol() {

    if (!this.titulo || !this.comentarios) {
      Swal.fire({
        allowOutsideClick: true,
        icon: 'error',
        title: 'debe completar titulo y/o comentarios',
        text: `Error creando rol`
      });
      return;
    }

    this.userService.createRol(this.titulo, this.comentarios).subscribe({
      next: (res) => {
        this.activeModal.close('actualizado')
        Swal.fire({
          allowOutsideClick: true,
          icon: 'info',
          title: `id_rol: ${res.id_rol}`,
          text: res.msg
        });
      },
      error: (err) => {
        Swal.fire({
          allowOutsideClick: true,
          icon: 'error',
          title: err.error.msg,
          text: `Error creando rol`
        });
      }
    })
  }

  cancelar() {
    this.activeModal.dismiss('cancelado');
  };

};
