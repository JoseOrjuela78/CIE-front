import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTable } from '../../../common/constans/models/IDataTable';
import { UtilitiesService } from '../../../common/utilities.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { AddUserComponent } from './modal/adduser.component';
import { UserService } from '../services/users.service';


@Component({
  selector: 'app-permits',
  standalone: true,
  templateUrl: './permits.component.html',
  styleUrls: ['./permits.component.css'],
  imports:[CommonModule, ReactiveFormsModule, FormsModule]
})
export class PermitsComponent implements OnInit{


  cantRegistros = [10, 30, 50];
  registrosXPagina = this.cantRegistros[0];
  totalRegistros: number = 0;
  paginaActual: number = 1;
  paginas: Array<number> = [];
  paginasMostrar: Array<number> = [];
  colsan: number = 0;
  buttons: any;
  datatable!: DataTable;
  showPages: boolean = false;
  nextFunction: boolean = false;
  lastPageFlag: boolean = false;
  searchForm!: FormGroup;
  restricciones:any= [];
  users:any= [];

  private utils = inject(UtilitiesService);
  private modalService = inject(NgbModal);
  private userService = inject(UserService);
  private cd = inject(ChangeDetectorRef);

  ngOnInit(): void {

    this.getRestricciones();
    this.searchForm = new FormGroup({
        'ordercolumn': new FormControl("ID_USUARIO"),
        'orderdirection': new FormControl("ASC"),
        'pagenumber': new FormControl(1),
        'pagesize': new FormControl(10),
        'identificacion': new FormControl(null),
        'nombre': new FormControl(null),
        'codigo': new FormControl(null),
        'status': new FormControl(null)
    });

    this.datatable = {
      headerRows: {
                    Identificacion: "Identificacion",
                    Nombre: "Nombre",
                    Opciones: 'opciones'
                  },
                    dataRows: []
    };

    this.buttons = {
                    previous: false,
                    next: false
    };

  };

  onSelectChange(event: Event) {
    return this.searchForm.get('status')?.setValue(1);
  };


  columnFunction(colunm:string){}

  onSubmit() {
      Swal.fire({
                allowOutsideClick: false,
                icon: 'info',
                text:'Espere por favor...'
      });
      Swal.showLoading();

      this.searchForm.get('pageNumer')?.setValue(this.paginaActual);
      this.searchForm.get('pagesize')?.setValue(this.registrosXPagina);

      // obtiene reporte
      this.userService.getUsersRestricted(this.searchForm.value).subscribe({
        next: (res) => {
          this.datatable.dataRows = res.users;
          this.totalRegistros = res.totalRegistros;
          this.paginas = this.utils.calcularCantidadPaginas(this.searchForm.value.pageSize, this.totalRegistros);
          this.verifyPaginationControls();

          const { currentPage, showPages, setPages } = this.utils.limitPagination(this.paginas, this.paginaActual, this.nextFunction, this.lastPageFlag);

          this.showPages = showPages;
          this.paginaActual = currentPage;
          this.paginasMostrar = setPages;
          this.cd.detectChanges();
          Swal.close();
          },
          error: (err) => {
                  this.datatable.dataRows = [];
                  this.cd.detectChanges();
                  Swal.fire({
                             allowOutsideClick: true,
                             icon: 'error',
                             title: err.error.msg,
                             text: `Error cargardo usuarios`
                             });
                  }

      })

  };

   onClear() {
      this.datatable.dataRows = [];
      this.paginas = [];
      return this.searchForm.reset();
    };

  verifyPaginationControls() {
        if (this.paginaActual < 1) {
          this.buttons.previous = true;
          this.buttons.next = false;
        };

        if (this.paginaActual >= this.paginas.length) {
          this.buttons.previous = false;
          this.buttons.next = true;
        };

        if (this.paginaActual > 1 && this.paginaActual < this.paginas.length) {
          this.buttons.previous = false;
          this.buttons.next = false;
        };

        if (this.paginas.length == 1) {
          this.buttons.previous = true;
          this.buttons.next = true;
        };
        console.log(this.buttons);
  };

  cambiarPagina(pagina: number) {
    this.paginaActual = pagina;
    this.searchForm.get('operacion')?.setValue(3);//consultar
    this.onSubmit();
  };

  previousPage() {
    this.nextFunction = false;
    this.lastPageFlag = false;
    this.cambiarPagina(this.paginaActual - 1);
  };

  nextPage() {
    this.nextFunction = true;
    this.cambiarPagina(this.paginaActual + 1);
  };

  firstPage() {
    this.nextFunction = false;
    this.lastPageFlag = false;
    this.cambiarPagina(1);
  };

  lastPage() {
    this.nextFunction = false;
    this.lastPageFlag = true;
    this.cambiarPagina(this.paginas.length - 1);
  };

  exportReport(){

  }

  getRestricciones() {
    Swal.fire({
      allowOutsideClick: false,
      icon: 'info',
      text: 'Espere por favor...'
    });
    Swal.showLoading();


    this.userService.getLista(5).subscribe({
      next: (data) => {
        this.restricciones = data.lista;
        this.cd.detectChanges();
        Swal.close()
      },
      error: (err) => {

        Swal.fire({
          allowOutsideClick: true,
          icon: 'error',
          title: err.error.msg,
          text: 'Error obteniendo restricciones'
        });
      }
    });

  };

  EliminarUsuario(id_usuario: number) {
    Swal.fire({
      allowOutsideClick: false,
      icon: 'info',
      text: 'Espere por favor...'
    });
    Swal.showLoading();

    this.userService.deleteRestriction(id_usuario, Number(this.searchForm.value.codigo)).subscribe({
      next: (data) => {
        console.log({ data });
        this.onSubmit();
        Swal.close();
      },
      error: (err) => {

        Swal.fire({
          allowOutsideClick: true,
          icon: 'error',
          title: err.error.msg,
          text: 'Error obteniendo restricciones'
        });
      }
    })
  }

  openAddUser() {
    const modalref = this.modalService.open(AddUserComponent, { size: 'lg' });
    modalref.componentInstance.codigo = this.searchForm.value.codigo;
    // Capturar resultado al cerrar
    modalref.result.then(
      (result) => {
        this.onSubmit();
        // aquí puedes refrescar lista, guardar cambios, etc.
      },
      (reason) => {
        console.log('Modal cancelado:', reason);
      }
    );
  }


}
