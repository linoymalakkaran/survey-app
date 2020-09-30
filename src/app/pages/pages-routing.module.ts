import { RouterModule, Routes } from '@angular/router';
import {  NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';
import { ServiceFormBuilderComponent } from './forms/formbuilder/formbuilder.component';
import { ServiceFormComponent } from './forms/form/form.component';
import { AuthGuard } from '../auth/auth.guard';
import { RoleName } from '../auth/auth_models/role_model';

const routes: Routes = [{
  path: '',
  component: PagesComponent,
  children: [
    {
      path: 'list',
      canActivate: [AuthGuard],
      component: ServiceFormBuilderComponent,
      pathMatch: 'full',
      data: { roles: [RoleName.Owner] }
    },
    {
      path: 'survey-detail/:id/:isclone',
      canActivate: [AuthGuard],
      component: ServiceFormComponent,
      pathMatch: 'full',
      data: { roles: [RoleName.Owner] }
    },
    {
      path: 'survey-detail/:id',
      canActivate: [AuthGuard],
      component: ServiceFormComponent,
      pathMatch: 'full',
      data: { roles: [RoleName.Owner] }
    },
    {
      path: 'survey-detail',
      canActivate: [AuthGuard],
      component: ServiceFormComponent,
      pathMatch: 'full',
      data: { roles: [RoleName.Owner] }
    },
    {
      path: 'submission',
      loadChildren: () => import('./submissions/submission.list.module')
        .then(m => m.FormSubmissionModule),
      runGuardsAndResolvers: 'always',
      data: { roles: [RoleName.Owner] }
    },
    // {
    //   path: '',
    //   redirectTo: 'submission',
    //   pathMatch: 'prefix'
    // },
    // {
    //   path: '**',
    //   redirectTo: 'submission',
    //   pathMatch: "prefix"
    // },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [AuthGuard],
  schemas: [
  ]
})
export class PagesRoutingModule {
}
