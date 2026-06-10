import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { catchError, Observable, throwError } from "rxjs";
import { URIS } from "../../../common/constans/uris";

@Injectable({
  providedIn: 'root'
})
export class QuotesService {

    private http = inject(HttpClient);

    getQuotes(idquote: number): Observable<any>{
        return this.http.get<any>(URIS.quotes.getQuotes +'/'+ idquote)
            .pipe(catchError((error) => throwError(() => error)));
    };

    getRefs(key:string): Observable<any>{
        return this.http.get<any>(URIS.refs.getRefs +'/'+ key)
            .pipe(catchError((error) => throwError(() => error)));
    };

    createQuote(cliente: string):Observable<any>{
        const body = { cliente };
        return this.http.post<any>(URIS.quotes.createQuote,body)
            .pipe(catchError((error) => throwError(() => error)));        
    };

    createQuoteDet(body:any):Observable<any>{
        const bd ={
                    "altoCM": Number(body.altoCM),
                    "anchoCM": Number(body.anchoCM),
                    "cantidad": Number(body.cantidad),
                    "id_cotizacion": Number(body.id_cotizacion),
                    "id_detalle": Number(body.id_detalle),
                    "largoCM": Number(body.largoCM),
                    "peso_kg":Number(body.peso_kg)
        };

        return this.http.post<any>(URIS.quotes.createQuoteDet,bd)
            .pipe(catchError((error) => throwError(() => error)));
    };

    updateQuoteDet(body:any):Observable<any>{

        const bd = {
                    "id_cotdetalle": Number(body.id_cotdetalle),
                    "cantidad": Number(body.cantidad),
                    "largoCM": Number(body.largoCM),
                    "anchoCM":Number(body.anchoCM),
                    "altoCM": Number(body.altoCM),
                    "peso_kg":Number(body.peso_kg)
        };

        return this.http.put<any>(URIS.quotes.updateQuoteDet,bd)
            .pipe(catchError((error) => throwError(() => error)));
    };

    generateQuote(body:any):Observable<any>{

        const bd ={
                    "id_detalle": Number(body.id_detalle),
                    "id_cotdetalle": Number(body.id_cotdetalle),
       };

        return this.http.put<any>(URIS.quotes.generateQuote,bd)
            .pipe(catchError((error) => throwError(() => error)));
    };

    closeQuote(id_cotizacion: number):Observable<any>{
        const body = { id_cotizacion };

        return this.http.post<any>(URIS.quotes.closeQuote,body)
            .pipe(catchError((error) => throwError(() => error)));
    };

    closeQuoteRow(id_cotTotales: number, id_cotizacion: number):Observable<any>{
        const body = {
                        id_cotTotales,
                        id_cotizacion
        };

        return this.http.put<any>(URIS.quotes.closeQuoteRow,body)
            .pipe(catchError((error) => throwError(() => error)));
    };

    cpeso(bd:any):Observable<any>{

        const body = {
                        id_detalle: bd.id_detalle,
                        cantidad: bd.cantidad,
                        peso_kg: bd.peso_kg,
                        largoCM: bd.largoCM,
                        anchoCM: bd.anchoCM,
                        altoCM: bd.altoCM
        };

        return this.http.put<any>(URIS.peso.cpeso,body)
            .pipe(catchError((error) => throwError(() => error)))

    };

    deleteIdQuoete(id:number):Observable<any>{
        return this.http.delete<any>(URIS.quotes.deleteQuoteDet +'/'+ id)
            .pipe(catchError((error) => throwError(() => error)))
    };

    gettotal(idQuote:number):Observable<any>{
        return this.http.get<any>(URIS.quotes.getTotalDto +'/'+ idQuote)
            .pipe(catchError((error) => throwError(() => error)))
    };

    getQuoteDetail(idQuote:number):Observable<any>{
        return this.http.get<any>(URIS.quotes.getQuoteDetail +'/'+ idQuote)
            .pipe(catchError((error) => throwError(() => error)))
    };

    getIdQuote(cliente:string, idUsuario:number):Observable<any>{
        return this.http.get<any>(URIS.quotes.getIdQuotes + '/' + cliente + '/' + idUsuario)
            .pipe(catchError((error) => throwError(() => error)))
    };

    getBrands():Observable<any>{
        return this.http.get<any>(URIS.quotes.getBrands)
            .pipe(catchError((error) => throwError(() => error)))
    };

    getSellers():Observable<any>{
        return this.http.get<any>(URIS.quotes.getSellers)
            .pipe(catchError((error) => throwError(() => error)))
    };

    getCustomers(idUsuario:number):Observable<any>{
        return this.http.get<any>(URIS.quotes.getCustomers + '/' + idUsuario)
            .pipe(catchError((error) => throwError(() => error)))
    };

    squareAsync(num: number): Observable<number> {
        return new Observable<number>((observer) => {
            setTimeout(() => {
                observer.next(num * num);
                observer.complete();
            }, 1000);
        });
    };

    asyncSum(a: number, b: number): Promise<number> {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(a + b);
            }, 1000);
        });
    };

    getRescue(status:number):Observable<any>{
        return this.http.get<any>(URIS.quotes.rescue +'/'+ status)
            .pipe(catchError((error) => throwError(() => error)))
    };

};