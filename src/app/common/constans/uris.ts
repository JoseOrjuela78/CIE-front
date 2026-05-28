import { enviromentdev } from '../../enviroments/enviroment.dev';
import { enviromentprod } from "../../enviroments/enviroment.prod";

const production = false;
const enviroment = {
  base: production ? enviromentprod.base : enviromentdev.base
};

export const URIS = {
usuarios: {
  createUser: enviroment.base + 'api/usuarios',
  login: enviroment.base + 'api/usuarios/login',
  updateUser: enviroment.base + 'api/usuarios'

},
quotes:{
  createQuote: enviroment.base + 'api/quote',
  createQuoteDet: enviroment.base + 'api/quote-detail',
  updateQuoteDet: enviroment.base + 'api/quote-detail',
  generateQuote: enviroment.base + 'api/quote-generate',
  getQuotes: enviroment.base + 'api/quote-get',
  closeQuote: enviroment.base + 'api/quote-close',
  closeQuoteRow: enviroment.base + 'api/quote-close-row',
  deleteQuoteDet: enviroment.base + 'api/quote-delete',
  getTotalDto: enviroment.base + 'api/quote-totaldto',
  getQuoteDetail: enviroment.base +  'api/quote-detail',
  getIdQuotes: enviroment.base + 'api/quotes',
  getBrands: enviroment.base + 'api/brands',
  getSellers: enviroment.base + 'api/sellers',
  getCustomers: enviroment.base + 'api/customers',
  putPDFDocument: enviroment.base + 'api/quotes/pdf',
  rescue: enviroment.base + 'api/rescue'

},
peso:{

  cpeso: enviroment.base + 'api/quote-cpeso'

},

refs:{
  getRefs: enviroment.base + 'api/refs-get'
},

tablas:{
  getTabla: enviroment.base + 'api/tables-get',
  putTables: enviroment.base + 'api/tables-upload'
  }
  ,
  reports: {
    stock: enviroment.base + 'api/reports/stock',
    generateCsv: enviroment.base + 'api/reports/csv'
  }

}
