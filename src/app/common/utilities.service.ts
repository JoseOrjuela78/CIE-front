

import { Injectable } from '@angular/core';

type PaginationResult = {
  currentPage: number;
  showPages: boolean;
  setPages: number[];
};

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

limitPagination(
  pages: number[],
  currentPage: number,
  nextFunction: boolean,
  lastPageFlag: boolean = false
): PaginationResult {
  let setPages: number[] = [];
  let lowerLimit: number;
  let upperLimit: number;
  let showPages: boolean = false;
  const totalRows: number = pages.length;

  // Caso: menos de 10 páginas
  if (totalRows < 10) {
    return { currentPage, showPages, setPages };
  }

  showPages = true;

  const cadaDiez = pages.filter((_, index) => (index + 1) % 10 === 0);
  const maxpage = Math.max(...pages);
  if (!cadaDiez.includes(maxpage)) cadaDiez.push(maxpage);

  // Caso: avanzar (next)
  if (
    cadaDiez.includes(currentPage - 1) &&
    currentPage <= totalRows &&
    nextFunction
  ) {
    lowerLimit = currentPage;
    upperLimit = Math.min(currentPage + 9, totalRows);
    setPages = Array.from({ length: upperLimit - lowerLimit + 1 }, (_, i) => lowerLimit + i);

    return { currentPage, showPages, setPages };
  }

  // Caso: retroceder (previous)
  if (
    (cadaDiez.includes(currentPage + 1) || currentPage === 1) &&
    currentPage > 0 &&
    !nextFunction
  ) {
    lowerLimit = currentPage === 1 ? 1 : Math.max(currentPage - 8, 1);
    upperLimit = Math.min(currentPage === 1 ? currentPage + 9 : currentPage + 1, totalRows);
    setPages = Array.from({ length: upperLimit - lowerLimit + 1 }, (_, i) => lowerLimit + i);

    if (lastPageFlag) currentPage = totalRows;

    return { currentPage, showPages, setPages };
  }

  // ✅ Caso por defecto (cuando no aplica ninguna condición anterior)
  lowerLimit = Math.max(currentPage - 4, 1);
  upperLimit = Math.min(currentPage + 5, totalRows);
  setPages = Array.from({ length: upperLimit - lowerLimit + 1 }, (_, i) => lowerLimit + i);

  return { currentPage, showPages, setPages };
}

  //funcion para limitar decimales
  decimales( num: number, dec: number){
    return Number(Number(num).toFixed(dec));
  };
}
