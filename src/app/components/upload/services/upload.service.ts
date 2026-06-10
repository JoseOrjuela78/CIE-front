import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { catchError, Observable, throwError } from "rxjs";
import { URIS } from "../../../common/constans/uris";

@Injectable({
  providedIn: 'root'
})
export class UploadService {
    
     private http = inject(HttpClient);

     getTable(table:string): Observable<any> {
         return this.http.get<any>(URIS.tablas.getTabla + "/" + table)
          .pipe(catchError((error) => throwError(() => error)));
     };

    putTable(table:string): Observable<any> {
         return this.http.put<any>(URIS.tablas.putTables + "/" + table,{})
          .pipe(catchError((error) => throwError(() => error)));
    };

    createUser(body:any){
      return this.http.post<any>(URIS.usuarios.createUser, body)  
        .pipe(catchError((error) => throwError(() => error)));
    };

    updateUser(body:any){
      const id = body.identificacion;
      return this.http.put<any>(URIS.usuarios.updateUser + "/" + id , body)
        .pipe(catchError((error) => throwError(() => error)));
    };

}