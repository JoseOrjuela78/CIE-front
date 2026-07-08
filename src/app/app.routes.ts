import { Routes } from '@angular/router';
import { authGuard } from './common/guard/can.activa.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./components/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: '',
    loadComponent: () =>
      import('./components/shared/content/content.component').then(m => m.ContentComponent),
    canActivate: [authGuard],
    children: [
      { path: 'quotes', loadComponent: () => import('./components/quotes/quote.component').then(m => m.QuotesComponent) },
      { path: 'upload', loadComponent: () => import('./components/upload/upload.component').then(m => m.UploadComponent) },
      {
        path: 'reports',
        children: [
          { path: 'med', loadComponent: () => import('./components/reports/med/med.component').then(m => m.MedComponent) },
          { path: 'quote', loadComponent: () => import('./components/reports/ver-quote/ver-quote.component').then(m => m.VerQuoteComponent) },
          { path: 'stock', loadComponent: () => import('./components/reports/stock/stock.component').then(m => m.StockComponent) }
        ]
      },
      {
        path: 'users',
        children: [
          { path: 'edit', loadComponent: () => import('./components/users/edit/edit.component').then(m => m.EditComponent) },
          { path: 'permits', loadComponent: () => import('./components/users/permits/permits.component').then(m => m.PermitsComponent) },
          { path: 'roles', loadComponent: () => import('./components/users/roles/roles.component').then(m => m.RolesComponent) }
        ]
      }
    ]
  },
  // wildcard
  { path: '**', redirectTo: '/login' }
];

/*
import { Routes } from '@angular/router';
import { authGuard } from './common/guard/can.activa.guard';
//import { CanActivateGuard } from './common/guard/can-activate.guard';

export const routes: Routes = [

  {
    path: 'login',
    loadComponent: () =>
      import('./components/login/login.component').then(m => m.LoginComponent)
  },

  {
    path: '',
    loadComponent: () =>
      import('./components/shared/content/content.component').then(m => m.ContentComponent),
    canActivate: [authGuard],
    children: [
      {
        path: 'quotes',
        loadComponent: () =>
          import('./components/quotes/quote.component').then(m => m.QuotesComponent)
      },
      {
        path: 'upload',
        loadComponent: () =>
          import('./components/upload/upload.component').then(m => m.UploadComponent)
      },
      {
        path: 'reports',
        children: [
          {
            path: 'med',
            loadComponent: () => import('./components/reports/med/med.component').then(m => m.MedComponent)
          },
          {
            path: 'quote',
            loadComponent: () => import('./components/reports/ver-quote/ver-quote.component').then(m => m.VerQuoteComponent)
          },
          {
            path: 'stock',
            loadComponent: () => import('./components/reports/stock/stock.component').then(m => m.StockComponent)
          }

        ]
      },
      {
        path: 'users',
        children: [
          {
            path: 'edit',
            loadComponent: () =>
              import('./components/users/edit/edit.component').then(m => m.EditComponent)
          },
          {
            path: 'permits',
            loadComponent: () =>
              import('./components/users/permits/permits.component').then(m => m.PermitsComponent)
          },
          {
            path: 'roles',
            loadComponent: () =>
              import('./components/users/roles/roles.component').then(m => m.RolesComponent)
          }
        ]
      }
      ]
  },

  // redirect root
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/login'
  },

  // wildcard
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: '/login'
  }
];
*/
