

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root' // disponible en toda la app
})
export class UtilitiesService{

  calcularCantidadPaginas(registrosXPagina: number, totalregistros: number): Array<number>{
    const cantidad = Math.ceil(totalregistros / registrosXPagina);
    const paginas = [];

  for(let i = 1; i <= cantidad; i++){
    paginas.push(i);
  };

  return paginas;

  };

  limitPagination(pages:number[], currentPage: number, nextFunction:boolean, lastPageFlag:boolean = false):any{

    let setPages:any = []
    let lowerLimit: number;
    let upperLimit: number;
    let showPages: boolean = false;
    const totalRows: number = pages.length;

    if(totalRows < 10) return { 
                                currentPage,
                                showPages,
                                setPages
                              };

    showPages = true;

    const cadaDiez = pages.filter((_, index) => (index + 1) % 10 === 0);
    const maxpage = Math.max(...pages);

    if (!cadaDiez.includes(maxpage)) cadaDiez.push(maxpage);

    
    //if next page
    if (cadaDiez.includes(currentPage - 1)
          && currentPage <= totalRows
          && nextFunction) {
          lowerLimit = currentPage;
          upperLimit = currentPage + 9;
          setPages = [];
          for (let i = lowerLimit; i <= upperLimit && i <= totalRows; i++) {
            setPages.push(i);
          };

          return {
                  currentPage,      
                  showPages,
                  setPages
                 }
    };

     //if previous page

    if ((cadaDiez.includes(currentPage + 1)
          || currentPage === 1)
          && currentPage > 0
          && !nextFunction
        ) {
          lowerLimit = currentPage === 1?1:currentPage - 8;
          upperLimit = currentPage === 1 ? currentPage + 9 : currentPage + 1;
          setPages = [];
          for (let i = lowerLimit; i <= upperLimit && i <= totalRows; i++) {
              setPages.push(i);
          };

          if (lastPageFlag) { currentPage = totalRows };

          return {
                  currentPage, 
                  showPages,
                  setPages
          }
          
    };
  };
}