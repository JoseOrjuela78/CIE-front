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
}