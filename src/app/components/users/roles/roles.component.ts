import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { DataTable } from '../../../common/constans/models/IDataTable';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UtilitiesService } from '../../../common/utilities.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EditRolComponent } from './modals/editarol.component';
import { UserService } from '../services/users.service';


@Component({
  selector: 'app-roles',
  standalone: true,
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.css'],
  imports:[CommonModule, ReactiveFormsModule, FormsModule]
})
export class RolesComponent implements OnInit {

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

  private utils = inject(UtilitiesService);
  private modalService = inject(NgbModal);
  private userService = inject(UserService);
  private cd = inject(ChangeDetectorRef);

  ngOnInit(): void {
     this.searchForm = new FormGroup({
        'ordercolumn': new FormControl("Marca"),
        'orderdirection': new FormControl("ASC"),
        'pagenumber': new FormControl(1),
        'pagesize': new FormControl(10),
        'id_rol' : new FormControl(null),
        'nombre_rol' : new FormControl(null),
        'descripcion' : new FormControl(null),
        'estado': new FormControl(null),
        'fechainicio': new FormControl(null),
        'fechafinal': new FormControl(null)
    });

    this.datatable = {
      headerRows: {
                    Idrol: "Idrol",
                    Titulo: "Titulo",
                    Descripcion: "Descripcion",
                    Estado: "Estado",
                    Opciones: "Opciones",
                  },
                  dataRows: []
    };
    this.onSubmit();
    this.buttons = {
                    previous: false,
                    next: false
    };

  };


  onSubmit() {
    Swal.fire({
              allowOutsideClick: false,
              icon: 'info',
              text:'Espere por favor...'
    });
    Swal.showLoading();

    this.searchForm.get('pagenumber')?.setValue(this.paginaActual);
    this.searchForm.get('pagesize')?.setValue(this.registrosXPagina);

    this.userService.getRoles(this.searchForm.value).subscribe({
      next: (res) => {

        // obtiene reporte
        this.datatable.dataRows = res.lista;
        this.totalRegistros = res.totalRegistros;
        this.paginas = this.utils.calcularCantidadPaginas(this.searchForm.value.pagesize, this.totalRegistros);
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
                       text: `Error cargardo roles`
                     });
                    }

    });



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

  openEditRol(idRol: number | undefined, titulo: string | undefined, estado: boolean | undefined) {
      const modalref = this.modalService.open(EditRolComponent);
      modalref.componentInstance.dataRol = {
        idRol:idRol,
        titulo:titulo,
        estado: estado
    };

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

