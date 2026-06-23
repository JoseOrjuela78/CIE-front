import { Component, inject, OnInit } from '@angular/core';
import { ReportsService } from '../services/reports.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { URIS } from '../../../common/constans/uris';
import { StorageService } from '../../../common/constans/storage.service';
import { sessionData } from '../../../common/constans/enums/storage.enum';


@Component({
  selector: 'app-ver-quote',
  standalone: true,
  templateUrl: './ver-quote.component.html',
  styleUrls: ['./ver-quote.component.css'],
  imports: [CommonModule, ReactiveFormsModule, FormsModule]
})
export class VerQuoteComponent implements OnInit {

  quoteDetail: any[] = [];
  quoteDta: any[] = [];
  quoteTotal: any[] = [];
  quoteTotalDto: any[] = [];
  quoteTotalZona: any[] = [];
  arrTitlesData: any = {};
  arrTitlesDataDetail: any = {};
  arrTitlesTotalZona: any = {};
  idQuotes: any[] = [];
  idSelected: number = 0;
  idRol: string = '';
  idSeller: number = 0;
  idSellers: any[] = [];
  customer: string = '';
  customers: any[] = [];
  botonPdf: boolean = false;
  arrRestrictions: any;
  restriction: number = 0;;

  //constructor(private quoteSvc: QuotesService, private auth: AuthService) { }


  private reportsService = inject(ReportsService);
  private storageService = inject(StorageService);


  ngOnInit(): void {
    const arr: any = sessionStorage.getItem(sessionData.restricciones) ? sessionStorage.getItem(sessionData.restricciones) : '[]';
    this.arrRestrictions = JSON.parse(arr);
    if (this.arrRestrictions.length > 0) {
      for (let row of this.arrRestrictions) {
        if (row.CODIGO === 21) {
          this.restriction = row.CODIGO;
          console.log(this.restriction)
          break;
        }
      };
    };

    this.getSellers();
  }

  verQuoteDetail(idQuote: number) {
    this.reportsService.getQuoteDetail(idQuote).subscribe((response: any) => {

      this.botonPdf = false;
      if (!(response.quoteDetail == null)) {
        this.botonPdf = true;
      };
      this.arrTitlesData = Object.keys(JSON.parse(response.quoteDta));
      this.quoteDta = JSON.parse("[" + response.quoteDta + "]");
      this.quoteDetail = JSON.parse(response.quoteDetail);
      this.arrTitlesDataDetail = Object.keys(JSON.parse(response.quoteDetail)[0]);
      //console.log(this.arrTitlesDataDetail);


      if (this.idRol == '3') {
        var indice = this.arrTitlesDataDetail.indexOf("costo_unitario"); // obtenemos el indice
        this.arrTitlesDataDetail.splice(indice, 1);
        indice = this.arrTitlesDataDetail.indexOf("costo_total");
        this.arrTitlesDataDetail.splice(indice, 1);
        indice = this.arrTitlesDataDetail.indexOf("flete");
        this.arrTitlesDataDetail.splice(indice, 1);
        indice = this.arrTitlesDataDetail.indexOf("zona");
        this.arrTitlesDataDetail.splice(indice, 1);
        indice = this.arrTitlesDataDetail.indexOf("moneda");
        this.arrTitlesDataDetail.splice(indice, 1);
        indice = this.arrTitlesDataDetail.indexOf("ajuste200USD");
        this.arrTitlesDataDetail.splice(indice, 1);
        indice = this.arrTitlesDataDetail.indexOf("costoLandedUSD");
        this.arrTitlesDataDetail.splice(indice, 1);

      };

      this.quoteTotalZona = JSON.parse(response.quoteTotalZona);
      this.arrTitlesTotalZona = Object.keys(JSON.parse(response.quoteTotalZona)[0]);
      this.quoteTotal = JSON.parse(response.quoteTotal);
      this.quoteTotalDto = JSON.parse(response.quoteTotalDto);

      return

    });
  }

  getIdQuotes() {
    this.reportsService.getIdQuote(this.customer, this.idSeller).subscribe((response: any) => {
      console.log(response)
      this.idQuotes = JSON.parse(response.data);
    })
  }

  idQuoteSelected() {

    this.verQuoteDetail(this.idSelected);
    return
  }


  getSellers() {

    this.reportsService.getSellers().subscribe((response: any) => {
      this.idSellers = response.list;
    });
  };

  getCustomers(idUsuario: number) {
    this.reportsService.getCustomers(idUsuario).subscribe((response: any) => {

      this.customers = response.list;

    });
  }


  idSellerSelected() {
    this.getCustomers(this.idSeller);
    return
  }

  customerSelected() {

    this.getIdQuotes();
    return
  }

  redirectToExternalUrl(status: number): void {

    this.reportsService.getRescue(status).subscribe((response: any) => {

      const externalUrl: string = URIS.pagepdf;
      window.open(externalUrl, '_blank');

    });
  }

}
