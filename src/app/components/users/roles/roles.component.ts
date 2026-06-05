import { Component, OnInit, inject } from '@angular/core';
import { DataTable } from '../../../common/constans/models/IDataTable';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UtilitiesService } from '../../../common/utilities.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EditRolComponent } from './modals/editarol.component';


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

  ngOnInit(): void {

    this.searchForm = new FormGroup({
        'ordenarPor': new FormControl("Marca"),
        'dirOrden': new FormControl("ASC"),
        'pageNumer': new FormControl(1),
        'pageSize': new FormControl(10),
        'idrol' : new FormControl(null),
        'titulo' : new FormControl(null),
        'descripcion' : new FormControl(null),
        'Estado' : new FormControl(null)
    });

    this.datatable = {
      headerRows: {
                    Idrol: "Idrol",
                    Titulo: "Titulo",
                    Descripcion: "Descripcion",
                    Estado: "Estado",
                    Opciones: "Opciones",
                  },
                    dataRows: [{idrol:1,titulo:'superAdmin',descripcion:'super administrador',estado:'Activo'}]
    };

    this.buttons = {
                    previous: false,
                    next: false
    };
  };

  generarReporte(){

  }

  columnFunction(colunm:string){

  }

  onSubmit() {
    Swal.fire({
              allowOutsideClick: false,
              icon: 'info',
              text:'Espere por favor...'
    });
    Swal.showLoading();

    this.searchForm.get('pageNumer')?.setValue(this.paginaActual);
    this.searchForm.get('pageSize')?.setValue(this.registrosXPagina);

  // obtiene reporte
      this.datatable.dataRows = []; //response.body.datos;
      this.totalRegistros = 0; //response.body.TotalRegistros;
      this.paginas = this.utils.calcularCantidadPaginas(this.searchForm.value.pageSize, this.totalRegistros);
      this.verifyPaginationControls();
      
      const {currentPage, showPages, setPages} = this.utils.limitPagination(this.paginas,this.paginaActual,this.nextFunction,this.lastPageFlag);

      this.showPages = showPages;
      this.paginaActual = currentPage;
      this.paginasMostrar = setPages;

    }

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

  openEditRol(idRol:number | null, titulo:string|null) {
      const modalref = this.modalService.open(EditRolComponent);
      modalref.componentInstance.dataRol = {
        idRol:idRol,
        titulo:titulo,
        estado: 0
 };
}

}
 
