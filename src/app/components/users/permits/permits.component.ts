import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTable } from '../../../common/constans/models/IDataTable';
import { UtilitiesService } from '../../../common/utilities.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { AddUserComponent } from './modal/adduser.component';

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

  ngOnInit(): void {

    this.searchForm = new FormGroup({
        'ordenarPor': new FormControl("Marca"),
        'dirOrden': new FormControl("ASC"),
        'pageNumer': new FormControl(1),
        'pageSize': new FormControl(10),
        'identificacion' : new FormControl(null),
        'nombre' : new FormControl(null),
    });

    this.datatable = {
      headerRows: {
                    Identificacion: "Identificacion",
                    Nombre: "Nombre",
                  },
                    dataRows: []
    };

    this.buttons = {
                    previous: false,
                    next: false
    };



    this.getRestricciones();
  }

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

  getRestricciones(){

    this.restricciones = [{codigo:1, valor:'Permiso informe Medellin'},
                          {codigo:2, valor:'Permiso informe stock'},
                          {codigo:3, valor:'Permiso informe referencias'}]

  }

  getUsuariosPorRestriccion(idRestriccion: number){

    this.users = [{id_usuario: 1, nombre: 'Juan Diaz'},{id_usuario: 2, nombre: 'Pedro Perez'},{id_usuario: 3, nombre: 'Ariana Lince'}]
  }

  agregarUsuario(idUsuario: number,idRestriccion: number ){

  }

  EliminarUsuario(idUsuario: number,idRestriccion: number ){
    
  }

  getUsuariosSinRestriccion(idRestriccion: number){

    this.users = [{id_usuario: 4, nombre: 'Fabian Arias'},{id_usuario: 5, nombre: 'Adriana Casas'},{id_usuario: 6, nombre: 'Andrea Duarte'}]
  }

  openAddUser(idRestriccion:number) {
        const modalref = this.modalService.open(AddUserComponent);
   //     modalref.componentInstance.restriccion = {
   //       idRestriccion
   //};
  }
}