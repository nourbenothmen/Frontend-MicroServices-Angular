// Angular Import
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// project import
import { AdminComponent } from './theme/layout/admin/admin.component';
import { GuestComponent } from './theme/layout/guest/guest.component';
import { RoleGuard } from './demo/guards/role.guard';


const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      {
        path: '',
        redirectTo: '/analytics',
        pathMatch: 'full'
      },
     {
  path: 'analytics',
  canActivate: [RoleGuard],
  data: { roles: ['Client', 'ResponsableSAV'] },
  loadComponent: () =>
    import('./demo/pages/Dashboard-ResponsableSAV/responsable-sav-dashboard.component')
      .then(c => c.ResponsableSavDashboardComponent)
},
 {
  path: 'client-dashboard',
  canActivate: [RoleGuard],
  data: { roles: ['Client'] },
  loadComponent: () =>
    import('./demo/pages/Dashboard-Client/client-dashboard.component')
      .then(c => c.ClientDashboardComponent)
},

      {
        path: 'component',
        loadChildren: () => import('./demo/ui-element/ui-basic.module').then((m) => m.UiBasicModule)
      },
      {
        path: 'chart',
        loadComponent: () => import('./demo/chart-maps/core-apex.component').then((c) => c.CoreApexComponent)
      },
      {
        path: 'forms',
        loadComponent: () => import('./demo/forms/form-elements/form-elements.component').then((c) => c.FormElementsComponent)
      },
    {
  path: 'GestionClients',
  canActivate: [RoleGuard],
  data: { roles: ['ResponsableSAV'] },
  loadComponent: () =>
    import('./demo/pages/customer-management/liste-costumer/liste-costumer.component')
      .then(c => c.ListeCostumerComponent)
},

      {
  path: 'GestionClients/add',  canActivate: [RoleGuard],
  data: { roles: ['ResponsableSAV'] },
  loadComponent: () => import('./demo/pages/customer-management/add-customer/add-costumer.component').then(c => c.AddCustomerComponent)
},
      {
  path: 'GestionArticles/add-article',  canActivate: [RoleGuard],
  data: { roles: ['ResponsableSAV'] },
  loadComponent: () => import('./demo/pages/article-management/add-article/add-article.component').then(c => c.AddArticleComponent)
},

{
  path: 'customer-management/edit-customer/:id',  canActivate: [RoleGuard],
  data: { roles: ['ResponsableSAV'] },
  loadComponent: () =>
    import('./demo/pages/customer-management/edit-costumer/edit-costumer.component')
      .then(m => m.EditCostumerComponent)
},

{
  path: 'GestionArticles/edit-article/:id',  canActivate: [RoleGuard],
  data: { roles: ['ResponsableSAV'] },
  loadComponent: () =>
    import('./demo/pages/article-management/edit-article/edit-article.component')
      .then(m => m.EditArticleComponent)
},{
  path: 'AddReclamation',
  canActivate: [RoleGuard],
  data: { roles: ['Client'] },
  loadComponent: () =>
    import('./demo/pages/customer-management/reclamation/add-reclamation/add-reclamation.component')
      .then(c => c.AddReclamationComponent)
},
{
  path: 'reclamations/details/:id',
  loadComponent: () =>
    import('./demo/pages/customer-management/reclamation/details-reclamation/details-reclamation.component')
      .then(c => c.DetailsReclamationComponent)
}

,
{
  path: 'MesReclamations',
  canActivate: [RoleGuard],
  data: { roles: ['Client'] },
  loadComponent: () =>
    import('./demo/pages/customer-management/reclamation/liste-reclamation/liste-reclamation.component')
      .then(c => c.ListeReclamationComponent)
},
{
  path: 'MesArticles',
  canActivate: [RoleGuard],
  data: { roles: ['Client'] },
  loadComponent: () =>
    import('./demo/pages/article-management/mes-articles/mesarticles.component')
      .then(c => c.MesArticlesComponent)
}
,
   {
        path: 'GestionReclamations',  canActivate: [RoleGuard],
  data: { roles: ['ResponsableSAV'] },
        loadComponent: () => import('./demo/pages/customer-management/reclamation/liste-reclamation/liste-reclamation.component').then((c) => c.ListeReclamationComponent)
      },
      {
        path: 'GestionArticles',  canActivate: [RoleGuard],
  data: { roles: ['ResponsableSAV'] },
        loadComponent: () => import('./demo/pages/article-management/liste-article/liste-article.component').then((c) => c.ListeArticleComponent )
      },
      {
        path: 'sample-page',
        loadComponent: () => import('./demo/other/sample-page/sample-page.component').then((c) => c.SamplePageComponent)
      },
      /* ============================= */
  /* 🔹 INTERVENTIONS (SAV) */
  /* ============================= */

  {
        path: 'interventions',  canActivate: [RoleGuard],
  data: { roles: ['ResponsableSAV'] },
        loadComponent: () => import('./demo/pages/intervention-management/liste-intervention/liste-intervention.component').then((c) => c.ListeInterventionComponent)
      },

      {
  path: 'interventions/:id/cloture',
  loadComponent: () => import('./demo/pages/intervention-management/liste-intervention/Facture/cloture-facturation.component').then(m => m.ClotureFacturationComponent)
},

 {
        path: 'techniciens',  canActivate: [RoleGuard],
  data: { roles: ['ResponsableSAV'] },
        loadComponent: () => import('./demo/pages/intervention-management/Technicien/liste-technicien/liste-technicien.component').then((c) => c.ListeTechnicienComponent)
      },
          {
  path: 'techniciens/add',  canActivate: [RoleGuard],
  data: { roles: ['ResponsableSAV'] },
  loadComponent: () => import('./demo/pages/intervention-management/Technicien/add-technicien/add-technicien.component').then(c => c.AddTechnicienComponent)
},
{
  path: 'techniciens/edit/:id',
  loadComponent: () =>
    import('./demo/pages/intervention-management/Technicien/edit-technicien/edit-technicien.component')
      .then(m => m.EditTechnicienComponent)
}
,

  {
        path: 'interventions/add',  canActivate: [RoleGuard],
  data: { roles: ['ResponsableSAV'] },
        loadComponent: () => import('./demo/pages/intervention-management/add-intervention/add-intervention.component').then((c) => c.AddInterventionComponent)
      },
  {
    path: 'interventions/edit/:id',  canActivate: [RoleGuard],
  data: { roles: ['ResponsableSAV'] },
    loadComponent: () => import('./demo/pages/intervention-management/edit-intervention/edit-intervention.component').then((c) => c.EditInterventionComponent)
  },
  {
    path: 'interventions/details/:id',  canActivate: [RoleGuard],
  data: { roles: ['ResponsableSAV'] },
    loadComponent: () => import('./demo/pages/intervention-management/liste-intervention/details-intervention.component').then((c) => c.DetailsInterventionComponent)
  },

  /* ============================= */
  /* 🔹 REDIRECTIONS */
  /* ============================= */

    ]
  },
  {
    path: '',
    component: GuestComponent,
    children: [
      {
        path: 'login',
        loadComponent: () => import('./demo/pages/authentication/sign-in/sign-in.component').then((c) => c.LoginComponent)
      },
      {
        path: 'register',
        loadComponent: () => import('./demo/pages/authentication/sign-up/sign-up.component').then((c) => c.RegisterComponent)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
