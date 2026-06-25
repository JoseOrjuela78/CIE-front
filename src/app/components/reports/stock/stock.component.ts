import { CommonModule } from "@angular/common";
import { ChangeDetectorRef, Component, inject, OnInit } from "@angular/core";
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";
import Swal from 'sweetalert2';
import { DataTable } from "../../../common/constans/models/IDataTable";
import { ReportsService } from "../services/reports.service";
import { UtilitiesService } from "../../../common/utilities.service";

@Component({
    selector: 'app-stock',
    standalone:true,
    templateUrl: './stock.component.html',
    styleUrls:['./stock.component.css'],
    imports:[CommonModule, ReactiveFormsModule,FormsModule]
})
export class StockComponent implements OnInit {

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
      showForm: boolean = false;
      searchForm!: FormGroup;
      bodegas: Array<any> = [];


      private utils = inject(UtilitiesService);
      private reportsService = inject(ReportsService);
      private cd = inject(ChangeDetectorRef);

    ngOnInit(): void {
        this.searchForm = new FormGroup({
            'ordenarPor': new FormControl("Marca"),
            'dirOrden': new FormControl("ASC"),
            'pageNumer': new FormControl(1),
            'pageSize': new FormControl(10),
            'almacen' : new FormControl(null),
            'marca' : new FormControl(null),
            'referencia' : new FormControl(null),
            'descripcion' : new FormControl(null),
            'fechaEI' : new FormControl(null),
            'fechaEF': new FormControl(null),
            'fechaSI': new FormControl(null),
            'fechaSF': new FormControl(null),
            'operacion': new FormControl(null)
        });

        this.datatable = {
            headerRows: {
                Fecha_Reporte: "Reporte de:",
                Marca: "Marca",
                Referencia: "Referencia",
                Descripcion: "Descripcion",
                Cantidad_Disponible: "Disponible",
                Cantidad_Vendida: "Vendidas",
                Fecha_Entrada: "Fecha Entrada",
                Fecha_Salida: "Fecha Salida",
                Almacen: "Almacen"
            },
            dataRows: []
        };

        this.buttons = {
            previous: false,
            next: false
      };
      this.getBodegas();
    };

    generarReporte() {
        this.searchForm.get('operacion')?.setValue(1);
        this.onSubmit();
        this.showForm = true;
  };

  getBodegas() {
      this.reportsService.getBodegas('all').subscribe({
        next: (res) => {
          this.bodegas = res.bodegas;
          this.cd.detectChanges();
        },
        error: (err) => {
          Swal.fire({
            allowOutsideClick: true,
            icon: 'error',
            title: err.error.msg,
            text: `Error cargardo bodegas`
          });
        }

      })
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

       this.reportsService.putReportStockCIE(this.searchForm.value).subscribe({
         next: (res) => {
            this.datatable.dataRows = res.body.datos;
            this.totalRegistros = res.body.TotalRegistros;
            this.paginas = this.utils.calcularCantidadPaginas(this.searchForm.value.pageSize, this.totalRegistros);
            this.verifyPaginationControls();

            const {currentPage, showPages, setPages} = this.utils.limitPagination(this.paginas,this.paginaActual,this.nextFunction,this.lastPageFlag);

            this.showPages = showPages;
            this.paginaActual = currentPage;
            this.paginasMostrar = setPages;
            Swal.close();
         },
         error: (err) => {
                   Swal.fire({
                     allowOutsideClick: true,
                     icon: 'error',
                     title: err.error.msg,
                     text: `Error cargardo reporte`
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

    columnFunction(column: string) {
        this.searchForm.get('orderBy')?.setValue(column);
        const orderBy = this.searchForm.get('dirOrden')?.value === "ASC" ? "DESC" : "ASC";
        this.searchForm.get('dirOrden')?.setValue(orderBy);
        this.firstPage();
    };

      exportReport() {
        Swal.fire({
          allowOutsideClick: false,
          icon: 'info',
          text: 'Generando csv...'

        });
        Swal.showLoading();

        //consultar
        this.searchForm.get('pageNumer')?.setValue(null);
        this.searchForm.get('pageSize')?.setValue(null);
        this.searchForm.get('operacion')?.setValue(2);

        console.log({ valuesExport: this.searchForm.value });
        this.reportsService.putReportStockCIE(this.searchForm.value).subscribe({
         next: (res) => {
          const json = res.body.datos;
          this.reportsService.putGenerateCsv(json).subscribe({
            next: (res) => {
                const csv = res.body.datos
                const blob = new Blob([csv], { type: 'text/csv' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                const fecha = new Date();
                const anio = fecha.getFullYear();
                const mes = String(fecha.getMonth() + 1).padStart(2, '0');
                const dia = String(fecha.getDate()).padStart(2, '0');
                const hora = String(fecha.getHours()).padStart(2, '0');
                const minutos = String(fecha.getMinutes()).padStart(2, '0');
                const segundos = String(fecha.getSeconds()).padStart(2, '0');

                // Código: AAAAMMDDHHMMSS
                const codigo = `${anio}${mes}${dia}${hora}${minutos}${segundos}`;

                a.download = `${codigo}.txt`;
                a.click();

                window.URL.revokeObjectURL(url);
                this.showForm = false;
                Swal.close();
            },
            error: (err) => {
                   Swal.fire({
                     allowOutsideClick: true,
                     icon: 'error',
                     title: err.error.msg,
                     text: `Error generando cvs`
                   });
            }
           });
         },
         error: (err) => {
                   Swal.fire({
                     allowOutsideClick: true,
                     icon: 'error',
                     title: err.error.msg,
                     text: `Error cargardo cvs`
                   });
                  }
        });
      };

}
