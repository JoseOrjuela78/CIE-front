
export interface DataTable {
    headerRows: HeaderRows;
    dataRows: any;
};


interface HeaderRows {
  [index: string]: string;
};