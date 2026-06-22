import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { catchError, Observable, throwError } from "rxjs";
import { URIS } from "../../../common/constans/uris";

@Injectable({
  providedIn: 'root'
})
export class ReportsService {

  private http = inject(HttpClient);

  putReportStock(body:any): Observable<any>{
        return this.http.put<any>(URIS.reports.stock, body)
            .pipe(catchError((error) => throwError(() => error)));
  };

  putGenerateCsv(body: any): Observable<any>{
        return this.http.put(URIS.reports.generateCsv, body)
            .pipe(catchError((error) => throwError(() => error)));
  };

  getQuoteDetail(idQuote: number): Observable<any> {
    return this.http.get<any>(URIS.quotes.getQuoteDetail + '/' + idQuote)
      .pipe(catchError((error) => throwError(() => error)));
  };

  getIdQuote(cliente: string, idUsuario: number): Observable<any> {
    return this.http.get<any>(URIS.quotes.getIdQuotes + '/' + cliente + '/' + idUsuario)
      .pipe(catchError((error) => throwError(() => error)));
  };

  getSellers(): Observable<any> {
    return this.http.get<any>(URIS.quotes.getSellers)
      .pipe(catchError((error) => throwError(() => error)));
  };

  getCustomers(idUsuario: number): Observable<any> {
    return this.http.get<any>(URIS.quotes.getCustomers + '/' + idUsuario)
      .pipe(catchError((error) => throwError(() => error)));
  };

  getRescue(status: number): Observable<any>{
    return this.http.get<any>(URIS.quotes.rescue + '/' + status)
      .pipe(catchError((error) => throwError(() => error)));
  };

}
