import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import Swal from 'sweetalert2';
import { QuotesService } from './services/quotes.service';
import { UtilitiesService } from '../../common/utilities.service';
import { IQuote } from '../../common/constans/models/IQuote';
import { MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-quote',
  standalone: true,
  templateUrl: './quote.component.html',
  styleUrls: ['./quote.component.css'],
  imports:[CommonModule, ReactiveFormsModule, FormsModule, MatTableModule,MatSortModule,MatPaginatorModule, MatIconModule, MatCardModule  ]
  
})
export class QuotesComponent  implements OnInit{

  displayedColumns: string[] = ['Index','Part_number','Brand','Description','Cantidad','Peso_total','PrecioCop','PrecioRes','Preciototal','PrecioTotalRes','Dto%','Actions'];
  dataSource = new MatTableDataSource<IQuote>([]);
  clickedRows = new Set<IQuote>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  quoteDetList:any[] = [];
  quoteTotList:any[] = [];
    viewDta = {
    peso_real:0,
    zona:0,
    flete:0,
    moneda:'',
    ajuste200USD :0,
    costoLandedUSD :0,
    costo_unitario: 0,
    costo_total: 0
  };

  refsList:any[] = [];
  statusForms: Boolean = false;
  addButton:Boolean = true;
  cotizarButton:Boolean = true;
  id_quote: number = 0;
  total: number = 0;
  idRol:string ='';
  brandsList:any[] = [];
  propiedadesDecimales!:string[];
  formBrands!: FormGroup;
  formQuoteDet!: FormGroup;


  private utils = inject(UtilitiesService);
  private quotesService = inject(QuotesService);

  ngOnInit(): void {
    this.formBrands = new FormGroup({
      'searchPart' : new FormControl('',[Validators.required]),
      'cliente' : new FormControl('',[Validators.required]),
      'part-number' : new FormControl('',[Validators.required])
    });

    this.formQuoteDet = new FormGroup({
      "id_cotizacion" : new FormControl('',[Validators.required]),
      "id_cotdetalle" : new FormControl(''),
      "id_detalle": new FormControl('',[Validators.required]),
      "cantidad": new FormControl('',[Validators.required]),
      "largoCM": new FormControl('',[Validators.required]),
      "anchoCM": new FormControl('',[Validators.required]),
      "altoCM":new FormControl('',[Validators.required]),
      "peso_kg": new FormControl('',[Validators.required]),
    });

    this.propiedadesDecimales = [
                                "peso_total",
                                "costo_unitario",
                                "costo_total",
                                "ajuste200USD",
                                "costoLandedUSD",
                                "preciolistaCOP",
                                "precioRescateCOP",
                                "preciototal",
                                "preciototalRescate",
                                "descuentoCOP"
                                ];


  };

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  };

  listar(idquote: number){

    this.dataSource.data = [];

    if( idquote == 0){
      return;
    };
    
    Swal.fire({
               allowOutsideClick: false,
               icon: 'info',
               text:'Espere por favor...'
              });
    Swal.showLoading();

    this.quotesService.getQuotes(idquote).subscribe({
       next: (res) => {
          this.total = res.body.total;
          const result:any = res.body.list;
          const ELEMENTDATA = new Array();

          if (result.length <= 0){
            Swal.fire({
                       allowOutsideClick: true,
                       icon: 'error',
                       title: 'datos no encontrados',
                       text: `Error cargardo detalle`
                      });
            return;
          };
         
          result.forEach((element:any, index:number) => {
              element.index = index + 1;
              this.propiedadesDecimales.forEach(prop => {
                element[prop] = this.utils.decimales(element[prop], 2);
              });
              ELEMENTDATA.push(element);
            });
            this.dataSource.data = ELEMENTDATA;
            Swal.close();
       },
       error: (err) => {
                      Swal.fire({
                        allowOutsideClick: true,
                        icon: 'error',
                        title: err.error.msg,
                        text: `Error cargardo cotizacion`
                      });
                     }

    });
  }

  getRefs(){

    const key =  this.formBrands.get('searchPart')?.value ;
    this.refsList = [];

    this.quotesService.getRefs(key).subscribe({
      next: (res) => {
            if(res.body.list.length > 0){
              this.refsList = res.body.list;
              console.log('refsList', this.refsList);
            };
      },
      error: (err) => {
                      Swal.fire({
                        allowOutsideClick: true,
                        icon: 'error',
                        title: err.error.msg,
                        text: `Error cargardo referencias`
                      });
                     }

    });
  };

  createQuote(){
    
    const cliente = this.formBrands.get('cliente')?.value;

    if (cliente == ''){
      this.statusForms = false;
      return;
    };

  this.quotesService.createQuote(cliente).subscribe({

      next: (res) => {
          this.statusForms = false;
          if (res.body.id_quote > 0){
            this.id_quote = Number(res.body.id_quote);
            this.statusForms = true;
          };
      },
      error: (err) => {
                      Swal.fire({
                        allowOutsideClick: true,
                        icon: 'error',
                        title: err.error.msg,
                        text: `Error creando cotizacion`
                      });
                     }
    }); 
  
  };

  createQuoteDet(){

    Swal.fire({
      allowOutsideClick: false,
      icon: 'info',
      text:'Espere por favor...'

    });
    Swal.showLoading()

    this.cotizarButton = true;
    this.formQuoteDet.get('id_cotizacion')?.setValue(this.id_quote)
    const idDetalle:any = this.formBrands.get('part-number')?.value;
    this.formQuoteDet.get('id_detalle')?.setValue(idDetalle);

  if (this.formQuoteDet.status == 'INVALID'){
    Swal.fire({
      allowOutsideClick: true,
      icon: 'error',
      title: 'Error',
      text: 'Debe completar datos'
       });
       return;
  }


  this.quotesService.cpeso(this.formQuoteDet.value).subscribe( {

      next: (res) => {
        if(res.body.code == 201){

        Swal.fire({
                  allowOutsideClick: true,
                  icon: 'error',
                  title: 'Error',
                  text: res.body.message
                  });
                  return
        };

        this.quotesService.createQuoteDet(this.formQuoteDet.value).subscribe({
          next: (res) => {
              const bd =  {
                          "id_detalle": idDetalle,
                          "id_cotdetalle": res.body.id_quote_detail
                          };

              this.quotesService.generateQuote(bd).subscribe({
                  next: (res) => {  
                                this.listar(this.id_quote);
                                this.formQuoteDet.reset();
                                Swal.close();
                  },
                  error: (err) => {
                      Swal.fire({
                        allowOutsideClick: true,
                        icon: 'error',
                        title: err.error.msg,
                        text: `Error generando cotizacion`
                      });
                     }

              });
          },
          error: (err) => {
                      Swal.fire({
                        allowOutsideClick: true,
                        icon: 'error',
                        title: err.error.msg,
                        text: `Error creando dellate cotizacion`
                      });
                     }

        });
      },
      error: (err) => {
                      Swal.fire({
                        allowOutsideClick: true,
                        icon: 'error',
                        title: err.error.msg,
                        text: `Error calculando peso`
                      });
                     }
    }); 
  };

updateQuoteDet(){
    Swal.fire({
              allowOutsideClick: false,
              icon: 'info',
              text:'Espere por favor...'
              });
    Swal.showLoading()

    this.quotesService.cpeso(this.formQuoteDet.value).subscribe({
      next: (res) => {  
            if(res.body.code == 201){
              Swal.fire({
                          allowOutsideClick: true,
                          icon: 'error',
                          title: 'Error',
                          text: res.body.message
              });
              return
            };

            this.quotesService.updateQuoteDet(this.formQuoteDet.value).subscribe({
              next: (res) => { 
                    this.cotizarButton = false;
                    const bd = JSON.parse(res.body.data);
                    this.quotesService.generateQuote(bd).subscribe({
                      next: (res) => {
                          this.listar(this.id_quote);
                          this.formQuoteDet.reset();
                          Swal.close();
                      },
                      error: (err) => {
                      Swal.fire({
                        allowOutsideClick: true,
                        icon: 'error',
                        title: err.error.msg,
                        text: `Error generando cotizacion`
                      });
                     }  

                    });
              },
              error: (err) => {
                      Swal.fire({
                        allowOutsideClick: true,
                        icon: 'error',
                        title: err.error.msg,
                        text: `Error actualizando detalle`
                      });
                     }

            });
      },
      error: (err) => {
                      Swal.fire({
                        allowOutsideClick: true,
                        icon: 'error',
                        title: err.error.msg,
                        text: `Error calculando peso`
                      });
                     }

    });
};

 closeQuote(){

    this.quoteDetList = [];

    this.quotesService.closeQuote(this.id_quote).subscribe({
      next: (res) => {  
            this.total = res.body.total;
            this.addButton = false;
            const arr = JSON.parse(res.body.rows);
            this.getTotalDto(this.id_quote);
      },
      error: (err) => {
                      Swal.fire({
                        allowOutsideClick: true,
                        icon: 'error',
                        title: err.error.msg,
                        text: `Error cerrando cotizacion`
                      });
                     }
    });
};

  newQuote(){
    this.formBrands.reset();
    this.dataSource.data = [];
    this.quoteDetList = [];
    this.quoteTotList = [];
    this.refsList = [];
    this.statusForms = false;
    this.addButton = true;
    this.id_quote = 0;
    this.total = 0;
    this.clearViewData();
    this.formBrands.get('cliente')?.setValue('');
    return
  };

  deleteIdQuote(id:number){
     this.quotesService.deleteIdQuoete(id).subscribe({
      next: (res) => {
        this.listar(this.id_quote);
      },
      error: (err) => {
                      Swal.fire({
                        allowOutsideClick: true,
                        icon: 'error',
                        title: err.error.msg,
                        text: `Error borrando cotizacion`
                      });
                     }

     });
};

  viewData(
    peso_real: number,
    zona: number,
    flete: number,
    moneda: string,
    ajuste200USD: number,
    costoLandedUSD: number,
    costo_unitario : number,
    costo_total: number
    ){

      this.viewDta.peso_real = peso_real;
      this.viewDta.zona = zona;
      this.viewDta.flete = flete;
      this.viewDta.moneda = moneda;
      this.viewDta.ajuste200USD = ajuste200USD;
      this.viewDta.costoLandedUSD = costoLandedUSD;
      this.viewDta.costo_unitario = costo_unitario;
      this.viewDta.costo_total = costo_total;
      return;

  };

  clearViewData(){
    this.viewDta.peso_real = 0;
    this.viewDta.zona = 0;
    this.viewDta.flete = 0;
    this.viewDta.moneda = '';
    this.viewDta.ajuste200USD = 0;
    this.viewDta.costoLandedUSD = 0;
    this.viewDta.costo_unitario = 0;
    this.viewDta.costo_total = 0;
  };

  editButton(
    id_cotdetalle: number,
    cantidad: number,
    largoCM: number,
    anchoCM: number,
    altoCM: number,
    peso_kg: number
    ){
    this.cotizarButton = false;
    this.formQuoteDet.get('id_cotdetalle')?.setValue(id_cotdetalle);
    this.formQuoteDet.get('cantidad')?.setValue(cantidad);
    this.formQuoteDet.get('largoCM')?.setValue(largoCM);
    this.formQuoteDet.get('anchoCM')?.setValue(anchoCM);
    this.formQuoteDet.get('altoCM')?.setValue(altoCM);
    this.formQuoteDet.get('peso_kg')?.setValue(peso_kg);
    return
  };

  getTotalDto(idQuote:number){
    this.quoteTotList = [];
    this.quotesService.gettotal(idQuote).subscribe({
      next: (res) => {
         this.quoteTotList = res.body.totalDto;
         this.listar(this.id_quote);
      },
      error: (err) => {
                      Swal.fire({
                        allowOutsideClick: true,
                        icon: 'error',
                        title: err.error.msg,
                        text: `Error calculando descuento`
                      });
                     }
    });
  };

  
  getbrands(){
    this.quotesService.getBrands().subscribe({
      next: (res) => {
            this.brandsList = [];
            this.brandsList = res.body.list;
      },
      error: (err) => {
                      Swal.fire({
                        allowOutsideClick: true,
                        icon: 'error',
                        title: err.error.msg,
                        text: `Error obteniendo marcas`
                      });
                     }
    });
  };
}