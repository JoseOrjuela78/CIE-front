import { enviromentdev } from '../../enviroments/enviroment.dev';
import { enviromentprod } from "../../enviroments/enviroment.prod";

const production = false;
const enviroment = {
  base: production ? enviromentprod.base : enviromentdev.base,
  pagepdf: production ? enviromentprod.page : enviromentdev.page,
};

export const URIS = {
usuarios: {
  createUser: enviroment.base + 'api/usuarios',
  login: enviroment.base + 'api/usuarios/login',
  updateUser: enviroment.base + 'api/usuarios',
  statusUser: enviroment.base + 'api/usuarios/status',
  passwordUser: enviroment.base + 'api/usuarios/update-pass',
  getUsers: enviroment.base + 'api/usuarios/get-pag',
  getLista: enviroment.base + 'api/listas',
  getCiudades: enviroment.base + 'api/cities',
  getRoles: enviroment.base + 'api/get-roles',
  getMenus: enviroment.base + 'api/rol/schema',
  createPermitsRol: enviroment.base + 'api/create-permits-rol',
  createRol: enviroment.base + 'api/create-rol',
  statusRol: enviroment.base + 'api/rol/status',
  getUsersRestricted: enviroment.base + 'api/get-users-restricted',
  deleteRestriction: enviroment.base + 'api/delete-restriction',
  createRestriction: enviroment.base + 'api/create-restriction'
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
    stockCIE: enviroment.base + 'api/reports/stock-cie',
    generateCsv: enviroment.base + 'api/reports/csv',
    getBodegas: enviroment.base + 'api/reports/get-bod'
  },

  pagepdf: enviroment.pagepdf

}
